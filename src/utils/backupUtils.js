const { PermissionFlagsBits, ChannelType } = require('discord.js');

/**
 * Utility functions for backup operations
 */
module.exports = {
  /**
   * Creates a permanent invite for a guild
   * @param {Guild} guild - The Discord guild
   * @returns {Promise<string|null>} Invite code or null if failed
   */
  async createPermanentInvite(guild) {
    try {
      // Find first available text channel with invite permissions
      const channel = guild.channels.cache.find(c => 
        c.type === ChannelType.GuildText &&
        c.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite) &&
        c.permissionsFor(guild.roles.everyone).has(PermissionFlagsBits.ViewChannel)
      );

      if (!channel) {
        console.warn(`No suitable channel found for invites in ${guild.name}`);
        return null;
      }

      const invite = await channel.createInvite({
        maxAge: 0,       // Permanent
        maxUses: 0,      // Unlimited uses
        unique: true,    // Unique invite
        reason: `Backup system invite for ${guild.name}`
      });

      return invite.code;
    } catch (error) {
      console.error(`Failed to create invite for ${guild.name}:`, error);
      return null;
    }
  },

  /**
   * Validates if a member can be backed up in a guild
   * @param {GuildMember} member - The guild member
   * @param {boolean} modOnly - Whether to check for mod permissions
   * @returns {boolean} True if backup is allowed
   */
  validateMemberForBackup(member, modOnly) {
    // Skip if modOnly and user doesn't have ManageGuild permission
    if (modOnly && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return false;
    }

    // Don't backup bot users
    if (member.user.bot) {
      return false;
    }

    return true;
  },

  /**
   * Prepares role data for backup
   * @param {Role} role - The Discord role
   * @returns {Object} Cleaned role data
   */
  prepareRoleData(role) {
    return {
      roleId: role.id,
      roleName: role.name,
      permissions: role.permissions.bitfield.toString(),
      isAdmin: role.permissions.has(PermissionFlagsBits.Administrator),
      color: role.hexColor,
      position: role.position,
      managed: role.managed
    };
  },

  /**
   * Filters out invalid roles from backup
   * @param {Array} roles - Array of role data
   * @returns {Array} Filtered roles
   */
  filterBackupRoles(roles) {
    return roles.filter(role => 
      !role.managed &&       // Remove bot-managed roles
      role.roleId !== role.guildId // Remove @everyone role
    );
  }
};
