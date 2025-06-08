require('dotenv').config();

module.exports = {
  prefix: process.env.PREFIX || 'i', // Or your preferred prefix
  token: process.env.TOKEN,
  mongoURI: process.env.MONGO_URI,
  backupSettings: {
    approvalChannelName: process.env.BACKUP_APPROVAL_CHANNEL || 'backup-approvals',
    defaultBackupExpiry: parseInt(process.env.BACKUP_EXPIRY_MS, 10) || 30 * 24 * 60 * 60 * 1000 // 30 a day
  }
};
