const Backup = require('../models/Backup');

module.exports = {
  name: 'guildDelete',
  async execute(guild) {
    try {
      console.log(`Left guild: ${guild.name} (${guild.id})`);
      
      // Remove all backups related to this guild
      const result = await Backup.updateMany(
        {},
        { $pull: { guilds: { guildId: guild.id } } }
      );
      
      console.log(`Cleaned up ${result.modifiedCount} backups for guild ${guild.id}`);
      
      // Remove backups that now have empty guilds array
      await Backup.deleteMany({ guilds: { $size: 0 } });
      
    } catch (error) {
      console.error(`Error cleaning up backups for guild ${guild.id}:`, error);
    }
  }
};