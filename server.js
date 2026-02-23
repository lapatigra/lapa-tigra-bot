const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID; //твой Telegram ID: 954676667

// Отправить сообщение тебе в Telegram
async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: OWNER_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    })
  });
}

// Принять уведомление о заказе (вызывается с сайта)
app.post('/api/notify', async (req, res) => {
  const { song, greeting, user } = req.body;

  const userName = user?.first_name || 'Гость';
  const userUsername = user?.username ? `@${user.username}` : '(без username)';
  const userId = user?.id || null;

  let message = `🎵 <b>НОВЫЙ ЗАКАЗ!</b>\n\n`;
  message += `👤 <b>Кто заказал:</b> ${userName} ${userUsername}\n`;
  if (userId) message += `🆔 ID: <code>${userId}</code>\n`;
  message += `\n🎶 <b>Песня:</b> ${song}\n`;
  message += `\n💬 <b>Поздравление:</b>\n${greeting}\n`;
  message += `\n💳 <b>Сумма:</b> 1000₽`;

  try {
    await sendTelegramMessage(message);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.json({ ok: false });
  }
});

// Когда пользователь открывает бота — редирект на мини-апп
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
