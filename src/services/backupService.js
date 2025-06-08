const { AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const Backup = require('../models/Backup');
const { getApprovalChannel } = require('../utils/permissionUtils');

class BackupService {
  /**
   * Sends a detailed backup report to the user via DM
   * @param {User} user - Discord user to send the backup to
   * @param {Object} backupData - Backup data from database
   */
  static async sendBackupDM(user, backupData) {
    try {
      const { guilds, userTag } = backupData;
      
      // Prepare rich text content with emojis and formatting
      let content = `📁 **Backup Report for ${userTag}**\n\n`;
      content += `⏰ **Generated at:** ${new Date().toLocaleString()}\n`;
      content += `🔢 **Total Servers:** ${guilds.length}\n\n`;
      
      // Add detailed server info with categorization
      content += "🛡️ **Server Backup Details**\n";
      guilds.forEach((guild, index) => {
        content += `\n**${index + 1}. ${guild.guildName}** \`[${guild.guildId}]\`\n`;
        content += `   📅 Joined: ${new Date(guild.joinedAt).toLocaleDateString()}\n`;
        content += `   🔗 Invite: ${guild.inviteCode ? `https://discord.gg/${guild.inviteCode}` : '⚠️ No invite created'}\n`;
        
        if (guild.roles.length > 0) {
          content += `   👑 **Roles (${guild.roles.length}):**\n`;
          guild.roles.forEach(role => {
            const roleType = role.isAdmin ? '🔴 Admin' : '🔵 Regular';
            content += `      - ${role.roleName} \`[${role.roleId}]\` (${roleType})\n`;
          });
        }
      });
      
      // Add mod servers section with clear labeling
      const modServers = guilds.filter(g => g.isMod);
      if (modServers.length > 0) {
        content += "\n🛠️ **Moderation Servers** (Where you have Manage Server permission)\n";
        modServers.forEach(guild => {
          content += `- ${guild.guildName} \`[${guild.guildId}]\`\n`;
        });
      }

      // Create and send formatted file
      const buffer = Buffer.from(content, 'utf-8');
      const attachment = new AttachmentBuilder(buffer, { 
        name: `Triecback-backup-${Date.now()}.txt`
      });
      
      await user.send({
        content: '✅ **Your server backup is ready!**\nHere are all the details:',
        files: [attachment]
      });
      
    } catch (error) {
      console.error('📨 Failed to send backup DM:', error);
      throw new Error('Failed to send backup details. Please ensure your DMs are open.');
    }
  }

  /**
   * Restores a user's backup to a specific guild with admin approval flow
   * @param {Guild} guild - Discord guild to restore to
   * @param {string} userId - User ID to restore backup for
   * @returns {Object} Restoration result
   */
  static async restoreBackup(guild, userId) {
    try {
      // Fetch backup with enhanced error handling
      const backup = await Backup.findOne({ userId });
      if (!backup) {
        throw new Error('No backup found for this user. Create one with /backup first.');
      }
      
      const guildBackup = backup.guilds.find(g => g.guildId === guild.id);
      if (!guildBackup) {
        throw new Error('No backup data exists for this server.');
      }

      const member = await guild.members.fetch(userId);
      const approvalChannel = await getApprovalChannel(guild);
      
      // Separate and validate roles
      const adminRoles = guildBackup.roles.filter(r => r.isAdmin && guild.roles.cache.has(r.roleId));
      const regularRoles = guildBackup.roles.filter(r => !r.isAdmin && guild.roles.cache.has(r.roleId));
      
      // Apply regular roles first with rate limiting
      try {
        await member.roles.set(regularRoles.map(r => r.roleId));
      } catch (roleError) {
        console.error('Failed to set regular roles:', roleError);
        throw new Error('Failed to restore some roles. The bot may need higher role position.');
      }
      
      // Handle admin roles with approval flow
      if (adminRoles.length > 0) {
        if (!approvalChannel) {
          return {
            success: true,
            adminApproved: false,
            message: 'Regular roles restored. Admin roles skipped (no approval channel configured).'
          };
        }

        // Send rich approval embed
        const approvalMessage = await approvalChannel.send({
          content: `📢 **Role Restoration Approval Needed**`,
          embeds: [{
            title: `⚠️ Admin Role Restoration Request`,
            description: `User <@${userId}> is requesting their admin roles be restored.`,
            fields: [
              {
                name: 'Requested Admin Roles',
                value: adminRoles.map(r => `• ${r.roleName}`).join('\n') || 'None'
              },
              {
                name: 'Approval Instructions',
                value: 'React with ✅ to approve or ❌ to deny within 5 minutes.'
              }
            ],
            color: 0xFFA500,
            timestamp: new Date()
          }]
        });
        
        await approvalMessage.react('✅');
        await approvalMessage.react('❌');
        
        // Enhanced reaction collector
        const filter = (reaction, user) => {
          const guildMember = guild.members.cache.get(user.id);
          return ['✅', '❌'].includes(reaction.emoji.name) && 
                 guildMember?.permissions.has(PermissionFlagsBits.ManageGuild) &&
                 !user.bot;
        };
        
        try {
          const collected = await approvalMessage.awaitReactions({
            filter,
            max: 1,
            time: 300000, // 5 minutes
            errors: ['time']
          });
          
          const reaction = collected.first();
          if (reaction.emoji.name === '✅') {
            await member.roles.add(adminRoles.map(r => r.roleId));
            return { 
              success: true, 
              adminApproved: true,
              message: 'All roles restored successfully, including admin roles.'
            };
          } else {
            return { 
              success: true, 
              adminApproved: false,
              message: 'Regular roles restored. Admin roles were not approved.'
            };
          }
        } catch (error) {
          return { 
            success: true, 
            adminApproved: false,
            message: 'Regular roles restored. Admin roles skipped (approval timed out).'
          };
        }
      }
      
      return { 
        success: true, 
        adminApproved: true,
        message: 'All roles restored successfully (no admin roles needed approval).'
      };
      
    } catch (error) {
      console.error('🔴 Backup restoration failed:', error);
      return { 
        success: false, 
        error: error.message,
        message: `Failed to restore backup: ${error.message}`
      };
    }
  }

  /**
   * Cleans up expired backups from the database
   * @returns {number} Number of backups deleted
   */
  static async cleanupExpiredBackups() {
    try {
      const result = await Backup.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      console.log(`🧹 Cleaned up ${result.deletedCount} expired backups`);
      return result.deletedCount;
    } catch (error) {
      console.error('Failed to clean up expired backups:', error);
      return 0;
    }
  }
}

module.exports = BackupService;