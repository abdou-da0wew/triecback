# Triecback - نظام النسخ الاحتياطي للمستخدمين على ديسكورد

![Discord](https://img.shields.io/badge/Discord-v14-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

> 🧠 Triecback هو جزء من نظام [Triecbot](https://triecbot.xyz) الذكي، واللي هدفه يخلي إدارة السيرفرات احترافية وسلسة.

---

## Tech Stack
<p align="center">
  <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/Discord.js-v14-blueviolet?style=for-the-badge&logo=discord" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-20.19.2%2B-green?style=for-the-badge&logo=node.js" /></a>
  <a href="https://mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Atlas%20Ready-brightgreen?style=for-the-badge&logo=mongodb" /></a>
</p>

---

## ✨ المميزات

- 🔄 إنشاء نسخة احتياطية كاملة من جميع السيرفرات المشتركة  
- 🔐 حفظ جميع الرولات والصلاحيات الخاصة بكل يوزر  
- 🔗 إنشاء دعوات دائمة (Permanent Invites) تلقائيًا  
- 🛡️ نظام موافقة ذكي لإعادة الصلاحيات الحساسة  
- 📬 إرسال تقرير مفصل بالـ DMs للمستخدم  
- ☁️ دعم MongoDB Atlas لتخزين آمن وسريع  
- 📆 حذف تلقائي للنسخ بعد 30 يوم لتقليل التخزين  

---

## 🛠️ متطلبات التثبيت

| الأداة       | الإصدار المطلوب          |
|-------------|--------------------------|
| Node.js     | v16 أو أعلى             |
| MongoDB     | Atlas أو سيرفر محلي      |
| Discord Bot | صلاحيات: `MANAGE_ROLES`, `CREATE_INSTANT_INVITE`, `SEND_MESSAGES`, `VIEW_CHANNEL` |

---

## 🔧 خطوات الإعداد

### 1. حمل المشروع
```bash
git clone https://github.com/abdou-da0wew/triecback.git
cd triecback
````

### 2. تثبيت البكجات

```bash
npm install
```

### 3. إعداد ملف البيئة `.env`

```env
TOKEN=حط التوكن هنا
MONGO_URI=رابط الداتا بيز
PREFIX=!  # أو أي برفكس يعجبك
CLIENT_ID=اكتب هنا ID البوت
```

### 4. تشغيل البوت

```bash
npm start
```

---

## 🚀 طريقة الاستخدام

### 🔸 أمر إنشاء النسخة الاحتياطية

```bash
ibackup true false
```

* أول `true/false`: هل تحفظ الرولات؟
* ثاني `true/false`: هل تحفظ فقط السيرفرات اللي عندك فيها صلاحيات إدارية؟

> ✅ يتم حفظ النسخ في قاعدة البيانات مباشرة، ومربوطة بحساب كل مستخدم.

---

### 🔹 استعادة النسخة الاحتياطية

* لما يدخل اليوزر تاني للسيرفر، Triecback بيطلب من الأدمن الموافقة على استرجاع رتبته.
* بمجرد الموافقة، بيتم تفعيل الرتب والصلاحيات تلقائيًا.

---

## 📂 ملفات المشروع

```bash
src/
├── commands/        # هنا ملف اللي بيكون فيه كل الاوامر
│   └── backup.js    # أمر النسخ
├── events/          # الأحداث (زي الانضمام للسيرفر)
│   └── guildCreate.js
├── models/          # الموديلز بتاعت MongoDB 
│   └── Backup.js
├── services/        # لوجيك استرجاع وحفظ البيانات
│   ├── backupService.js
│   └── databaseService.js
├── utils/           # الملفات المساعدة (زي الإنفايتات)
│   ├── backupUtils.js
│   └── permissionUtils.js 
├── config.js       # طبقه حماية لأنها بتجيب المتغيرات من .env
├── .env # هنا أي متغيرات زي التوكن او الحجات الحساسة
└── index.js        # نقطة البداية
```

---

## 📜 الأوامر المدعومة

| الأمر         | الوظيفة                             | مثال                 |
| ------------- | ----------------------------------- | -------------------- |
| `!backup <r>` | إنشاء نسخة احتياطية مع/بدون الرولات | `!backup true false` |

---

## 📸 صورة من جوا النظام

<p float="left">
  <img src="https://cdn.triecbot.xyz/media/aha0gt0.png" width="400"/>
  <img src="https://cdn.triecbot.xyz/media/qhgc4t9.png" width="400"/>
</p>

---

## 🧠 أمور لازم تعرفها

* 📅 النسخ تُحذف تلقائيًا بعد **30 يوم** من تاريخ الإنشاء.
* ✅ البوت يحتاج صلاحيات أدمن لتطبيق الرتب والدعوات.
* 📤 التقارير يتم إرسالها للمستخدم مباشرة على الخاص.

---

## 🤝 المساهمة

عايز تطور Triecback؟ تعال ساهم:

```bash
git clone fork https://github.com/Abdou-rx/triecback
git checkout -b feature/super-idea
git commit -m "ضفت ميزة جامدة 🔥"
```

---

## 📞 الدعم والتواصل

* GitHub: [Abdou-rx](https://github.com/Abdou-rx)
* الحساب التاني: [abdou-da0wew](https://github.com/abdou-da0wew)
* الموقع الرسمي: [Triecbot.xyz](https://triecbot.xyz)
* دعوة البوت: [اضغط هنا](https://reg.triecbot.xyz/invite)
* سيرفر الدعم: [Join Support](https://reg.triecbot.xyz/support)

---

## ⚖️ الترخيص

هذا المشروع مرخص تحت رخصة [MIT License](LICENSE).

---

> 🧬 Triecback هو جزء من منظومة أدوات **Triecbot** لتسهيل إدارة السيرفرات الذكية 🔥

---

## About Developer 

<p align="center">
  <img src="https://img.shields.io/badge/Developer-Abdou-black?style=for-the-badge&logo=github" />
  <a href="https://github.com/Abdou-rx">
    <img src="https://img.shields.io/badge/GitHub-Abdou--rx-black?style=for-the-badge&logo=github" />
  </a>
  <img src="https://img.shields.io/badge/-TriecBot-blue?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABU5EDbAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATklEQVQoz2NgGAWjYBSMglEwCkQGwUgH4F+J3IPoUqokwxgYiA3QP4PGBHgMog0wAI8PMdAKkpGY0A6AhJ+0NInMGkBQBBLhVQP2D6rQAAAABJRU5ErkJggg==" />
  <img src="https://triecbot.xyz/images/logo.png" alt="TriecBot Logo" width="30" />
</p>
