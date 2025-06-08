const { PermissionFlagsBits, ChannelType } = require('discord.js');

async function createPermanentInvite(guild) {
  try {
    // Try to find a suitable channel
    const channel = guild.channels.cache.find(c => 
      c.type === ChannelType.GuildText &&
      c.permissionsFor(guild.me).has(PermissionFlagsBits.CreateInstantInvite)
    );

    if (!channel) {
      console.warn(`No suitable channel found for invites in guild ${guild.id}`);
      return null;
    }

    const invite = await channel.createInvite({
      maxAge: 0, // Permanent
      maxUses: 0, // Unlimited uses
      unique: true,
      reason: 'Backup system invite'
    });

    return invite.code;
  } catch (error) {
    console.error(`Error creating invite for guild ${guild.id}:`, error);
    return null;
  }
}

module.exports = {
  createPermanentInvite
};
const Backup = require('../models/Backup');

class DatabaseService {
  static async getUserBackup(userId) {
    return await Backup.findOne({ userId });
  }

  static async updateBackup(userId, guilds) {
    return await Backup.findOneAndUpdate(
      { userId },
      { $set: { guilds } },
      { upsert: true, new: true }
    );
  }

  static async deleteBackup(userId) {
    return await Backup.deleteOne({ userId });
  }

  static async cleanupExpiredBackups() {
    // MongoDB TTL index will handle automatic deletion
    const result = await Backup.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    return result.deletedCount;
  }
}

module.exports = DatabaseService;