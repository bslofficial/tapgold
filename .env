const TelegramBot = require('node-telegram-bot-api');

// আপনার বটের নতুন টোকেনটি এখানে দিন
const token = '7910509494:AAGrDcU2AKT1eXZIbOD5W-kS5asFh34auf0'; 

const bot = new TelegramBot(token, { polling: true });

// /start কমান্ড দিলে গেম ওপেন করার বাটন দেখাবে
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;

    bot.sendMessage(chatId, `স্বাগতম ${userName}! TapGold এ আপনাকে স্বাগতম। নিচে ক্লিক করে গেমটি শুরু করুন:`, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "🎮 গেম খেলুন (TapGold)",
                    web_app: { url: "https://bslofficial.github.io/tapgold/" }
                }]
            ]
        }
    });
});

console.log("বট চালু হয়েছে...");
