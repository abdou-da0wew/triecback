const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  userTag: { type: String, required: true },
  guilds: [{
    guildId: { type: String, required: true },
    guildName: { type: String, required: true },
    inviteCode: { type: String },
    isMod: { type: Boolean, default: false },
    joinedAt: { type: Date },
    roles: [{
      roleId: { type: String, required: true },
      roleName: { type: String, required: true },
      permissions: { type: String, required: true },
      isAdmin: { type: Boolean, default: false },
      color: { type: String },
      position: { type: Number }
    }]
  }],
  expiresAt: { type: Date, index: { expires: 0 } }
}, { timestamps: true });

module.exports = mongoose.model('Backup', backupSchema);