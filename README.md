# Triecback - User Backup System for Discord Servers

![Discord](https://img.shields.io/badge/Discord-v14-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

> 🧠 Triecback is a core part of the [Triecbot](https://triecbot.xyz) smart ecosystem, designed to make server management smooth, smart, and professional.


[🇪🇬 Arabic Translation](./lang/README-AR.md)

---

## Tech Stack
<p align="center">
  <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/Discord.js-v14-blueviolet?style=for-the-badge&logo=discord" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-20.19.2%2B-green?style=for-the-badge&logo=node.js" /></a>
  <a href="https://mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Atlas%20Ready-brightgreen?style=for-the-badge&logo=mongodb" /></a>
</p>

---

## ✨ Features

- 🔄 Full backup of all mutual servers  
- 🔐 Stores user roles and permissions accurately  
- 🔗 Auto-generates permanent invite links  
- 🛡️ Smart approval system for restoring sensitive permissions  
- 📬 Sends detailed DM reports to users  
- ☁️ MongoDB Atlas support for secure and fast storage  
- 📆 Auto-delete backups after 30 days to save space  

---

## 🛠️ Requirements

| Tool         | Required Version          |
|--------------|----------------------------|
| Node.js      | v16 or higher              |
| MongoDB      | Atlas or local instance    |
| Discord Bot  | Permissions: `MANAGE_ROLES`, `CREATE_INSTANT_INVITE`, `SEND_MESSAGES`, `VIEW_CHANNEL` |

---

## 🔧 Setup Instructions

### 1. Clone the project
```bash
git clone https://github.com/abdou-da0wew/triecback.git
cd triecback
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure `.env` file
```env
TOKEN=your_token_here
MONGO_URI=your_mongodb_uri
PREFIX=!  # or any prefix you like
CLIENT_ID=your_bot_id
```

### 4. Start the bot
```bash
npm start
```

---

## 🚀 Usage Guide

### 🔸 Create Backup Command

```bash
!backup true false
```

* First `true/false`: Save user roles?
* Second `true/false`: Only include servers where you have admin rights?

> ✅ Backups are stored in the database and linked to each user’s account.

---

### 🔹 Restore Backup

* When the user rejoins a server, Triecback will ask admins for permission to restore their roles.
* Once approved, the roles and permissions will be applied automatically.

---

## 📂 Project Structure

```bash
src/
├── commands/        # All commands
│   └── backup.js    # Backup command
├── events/          # Discord events like guild join
│   └── guildCreate.js
├── models/          # MongoDB models
│   └── Backup.js
├── services/        # Backup and DB logic
│   ├── backupService.js
│   └── databaseService.js
├── utils/           # Helper utilities
│   ├── backupUtils.js
│   └── permissionUtils.js 
├── config.js        # Loads environment variables
├── .env             # Sensitive keys and configs
└── index.js         # Main entry point
```

---

## 📜 Supported Commands

| Command          | Description                          | Example               |
|------------------|--------------------------------------|------------------------|
| `!backup <r>`    | Create a backup with/without roles   | `!backup true false`   |

---

## 📸 Screenshots

<p float="left">
  <img src="https://cdn.triecbot.xyz/media/aha0gt0.png" width="400"/>
  <img src="https://cdn.triecbot.xyz/media/qhgc4t9.png" width="400"/>
</p>

---

## 🧠 Notes

* 📅 Backups are automatically deleted after **30 days**.
* ✅ Bot must have admin permissions to apply roles and generate invites.
* 📤 Backup reports are sent directly to the user via DM.

---

## 🤝 Contributing

Wanna improve Triecback? Fork and go wild:

```bash
git clone fork https://github.com/Abdou-rx/triecback
git checkout -b feature/super-idea
git commit -m "Added a cool feature 🔥"
```

---

## 📞 Support & Contact

* GitHub: [Abdou-rx](https://github.com/Abdou-rx)
* Backup GitHub: [abdou-da0wew](https://github.com/abdou-da0wew)
* Official Website: [Triecbot.xyz](https://triecbot.xyz)
* Invite Bot: [Click here](https://reg.triecbot.xyz/invite)
* Support Server: [Join Support](https://reg.triecbot.xyz/support)

---

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).

---

## About the Developer

<p align="center">
  <img src="https://img.shields.io/badge/Developer-Abdou-black?style=for-the-badge&logo=github" />
  <a href="https://github.com/Abdou-rx">
    <img src="https://img.shields.io/badge/GitHub-Abdou--rx-black?style=for-the-badge&logo=github" />
  </a>
  <img src="https://img.shields.io/badge/-TriecBot-blue?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABU5EDbAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATklEQVQoz2NgGAWjYBSMglEwCkQGwUgH4F+J3IPoUqokwxgYiA3QP4PGBHgMog0wAI8PMdAKkpGY0A6AhJ+0NInMGkBQBBLhVQP2D6rQAAAABJRU5ErkJggg==" />
  <img src="https://triecbot.xyz/images/logo.png" alt="TriecBot Logo" width="30" />
</p>
