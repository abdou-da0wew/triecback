const { PermissionFlagsBits, ChannelType } = require('discord.js');
const Backup = require('../models/Backup');
const { createPermanentInvite } = require('../utils/backupUtils');
const { sendBackupDM } = require('../services/backupService');
const { getApprovalChannel } = require('../utils/permissionUtils');

module.exports = {
  name: 'backup',
  description: 'Create a backup of your servers and permissions',
  usage: 'backup <save-permissions> <mod-only>',
  aliases: ['savebackup'],
  permissions: [PermissionFlagsBits.SendMessages],
  
  async execute(message, args) {
    // Delete the command message if possible
    if (message.deletable) {
      message.delete().catch(console.error);
    }

    // Send initial response
    const replyMsg = await message.channel.send('⏳ Creating your backup...');

    try {
      // Parse arguments
      if (args.length < 2) {
        return replyMsg.edit('❌ Usage: `backup <save-permissions> <mod-only>`\nExample: `backup true false`');
      }

      const savePermissions = args[0].toLowerCase() === 'true';
      const modOnly = args[1].toLowerCase() === 'true';
      const userId = message.author.id;
      const userTag = message.author.tag;

      // Get mutual guilds between bot and user
      const mutualGuilds = message.client.guilds.cache.filter(g => 
        g.members.cache.has(userId)
      );

      if (mutualGuilds.size === 0) {
        return replyMsg.edit('❌ You are not in any mutual servers with the bot.');
      }

      const backupData = {
        userId,
        userTag,
        guilds: []
      };

      // Process each guild
      for (const guild of mutualGuilds.values()) {
        try {
          const member = await guild.members.fetch(userId);
          
          // Skip if modOnly and user doesn't have ManageGuild permission
          if (modOnly && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            continue;
          }

          const guildEntry = {
            guildId: guild.id,
            guildName: guild.name,
            inviteCode: null,
            roles: [],
            isMod: member.permissions.has(PermissionFlagsBits.ManageGuild),
            joinedAt: member.joinedAt.toISOString()
          };

          // Create permanent invite
          try {
            const channel = guild.channels.cache.find(c => 
              c.type === ChannelType.GuildText &&
              c.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite)
            );
            
            if (channel) {
              const invite = await channel.createInvite({
                maxAge: 0, // Permanent
                maxUses: 0, // Unlimited uses
                unique: true,
                reason: `Backup system invite for ${userTag}`
              });
              guildEntry.inviteCode = invite.code;
            }
          } catch (inviteError) {
            console.error(`Failed to create invite for guild ${guild.id}:`, inviteError);
          }

          // Save roles if requested
          if (savePermissions) {
            for (const role of member.roles.cache.values()) {
              if (role.id === guild.id) continue; // Skip @everyone role

              guildEntry.roles.push({
                roleId: role.id,
                roleName: role.name,
                permissions: role.permissions.bitfield.toString(),
                isAdmin: role.permissions.has(PermissionFlagsBits.Administrator),
                color: role.hexColor,
                position: role.position
              });
            }
            
            // Sort roles by position (highest first)
            guildEntry.roles.sort((a, b) => b.position - a.position);
          }

          backupData.guilds.push(guildEntry);
        } catch (guildError) {
          console.error(`Error processing guild ${guild.id}:`, guildError);
        }
      }

      if (backupData.guilds.length === 0) {
        return replyMsg.edit(modOnly 
          ? '❌ You don\'t have moderation rights in any mutual servers.' 
          : '❌ No servers found matching your criteria.');
      }

      // Save to MongoDB with 30-day expiration
      await Backup.findOneAndUpdate(
        { userId },
        { 
          ...backupData,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        },
        { upsert: true, new: true }
      );

      // Send DM with backup info
      await sendBackupDM(message.author, backupData);

      await replyMsg.edit('✅ Backup completed successfully! Check your DMs for details.');

    } catch (error) {
      console.error('Error executing backup command:', error);
      replyMsg.edit('❌ An error occurred while creating the backup. Please try again later.');
    }
  },

  // Additional method for restoring backup
  async restoreBackup(guild, userId) {
    try {
      const backup = await Backup.findOne({ userId });
      if (!backup) return { success: false, message: 'No backup found' };

      const guildBackup = backup.guilds.find(g => g.guildId === guild.id);
      if (!guildBackup) return { success: false, message: 'No backup for this guild' };

      const member = await guild.members.fetch(userId);
      const approvalChannel = await getApprovalChannel(guild);

      // Separate admin and regular roles
      const adminRoles = guildBackup.roles.filter(r => r.isAdmin);
      const regularRoles = guildBackup.roles.filter(r => !r.isAdmin);

      // Apply regular roles first
      await member.roles.set(regularRoles.map(r => r.roleId));

      // Handle admin roles with approval
      if (adminRoles.length > 0 && approvalChannel) {
        const approvalMessage = await approvalChannel.send({
          content: `⚠️ **Role Restoration Approval**\n` +
                   `User: <@${userId}>\n` +
                   `Requested admin roles:\n${adminRoles.map(r => `- ${r.roleName}`).join('\n')}\n\n` +
                   `Please react with ✅ to approve or ❌ to deny within 5 minutes.`,
        });

        await approvalMessage.react('✅');
        await approvalMessage.react('❌');

        const filter = (reaction, user) => {
          const guildMember = guild.members.cache.get(user.id);
          return ['✅', '❌'].includes(reaction.emoji.name) && 
                 guildMember?.permissions.has(PermissionFlagsBits.ManageGuild);
        };

        try {
          const collected = await approvalMessage.awaitReactions({
            filter,
            max: 1,
            time: 300000 // 5 minutes
          });

          const reaction = collected.first();
          if (reaction?.emoji.name === '✅') {
            await member.roles.add(adminRoles.map(r => r.roleId));
            return { 
              success: true, 
              message: 'Roles restored (including admin roles)',
              adminApproved: true
            };
          }
        } catch (error) {
          console.error('Approval process error:', error);
        }

        return { 
          success: true, 
          message: 'Roles restored (without admin roles - not approved)',
          adminApproved: false
        };
      }

      return { success: true, message: 'Roles restored' };
    } catch (error) {
      console.error('Restore backup error:', error);
      return { success: false, message: error.message };
    }
  }
};