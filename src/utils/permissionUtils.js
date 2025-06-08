const { PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  /**
   * Get or create the approval channel for a guild
   * @param {Guild} guild - The Discord guild
   * @returns {Promise<TextChannel>} The approval channel
   */
  async getApprovalChannel(guild) {
    try {
      // Try to find existing channel
      const existingChannel = guild.channels.cache.find(
        c => c.name === 'backup-approvals' && c.type === ChannelType.GuildText
      );
      
      if (existingChannel) return existingChannel;

      // Create new channel if not exists
      const newChannel = await guild.channels.create({
        name: 'backup-approvals',
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: guild.members.me.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.EmbedLinks
            ]
          }
        ],
        reason: 'Backup system approval channel'
      });

      return newChannel;
    } catch (error) {
      console.error(`Failed to get approval channel for ${guild.id}:`, error);
      return null;
    }
  },

  /**
   * Check if user has admin permissions
   * @param {GuildMember} member - The guild member
   * @returns {boolean} True if has admin permissions
   */
  hasAdminPermissions(member) {
    return member.permissions.has(PermissionFlagsBits.Administrator) || 
           member.permissions.has(PermissionFlagsBits.ManageGuild);
  }
};