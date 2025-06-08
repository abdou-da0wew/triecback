const Backup = require('../models/Backup');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    console.log(`Joined new guild: ${guild.name} (${guild.id})`);
    
    // Create approval channel if it doesn't exist
    const existingChannel = guild.channels.cache.find(
      c => c.name === 'backup-approvals' && c.type === 'GUILD_TEXT'
    );
    
    if (!existingChannel) {
      try {
        await guild.channels.create('backup-approvals', {
          type: 'GUILD_TEXT',
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: ['VIEW_CHANNEL']
            },
            {
              id: guild.me.id,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS']
            }
          ],
          reason: 'Backup system approval channel'
        });
      } catch (error) {
        console.error(`Failed to create approval channel in ${guild.id}:`, error);
      }
    }
  }
};