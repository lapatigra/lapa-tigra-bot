const https = require('https');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    const { song, greeting, user } = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;

    const userName = user?.first_name || 'Гость';
    const userUsername = user?.username ? `@${user.username}` : '(без username)';
    const userId = user?.id || null;

    let message = `🎵 НОВЫЙ ЗАКАЗ!\n\n`;
    message += `👤 Кто заказал: ${userName} ${userUsername}\n`;
    if (userId) message += `🆔 ID: ${userId}\n`;
    message += `\n🎶 Песня: ${song}\n`;
    message += `\n💬 Поздравление:\n${greeting}\n`;
    message += `\n💳 К оплате: 1000₽ через Яндекс Чаевые — заказ оформлен, проверьте, пришла ли оплата`;

    const data = JSON.stringify({
        chat_id: OWNER_CHAT_ID,
        text: message
    });

    await new Promise((resolve, reject) => {
        const request = https.request({
            hostname: 'api.telegram.org',
            path: `/bot${BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, resolve);
        request.on('error', reject);
        request.write(data);
        request.end();
    });

    res.status(200).json({ ok: true });
};
