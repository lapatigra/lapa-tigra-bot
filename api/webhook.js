module.exports = async (req, res) => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const body = req.body;
    
    if (body?.message?.text === '/start') {
        const chatId = body.message.chat.id;
        const webAppUrl = process.env.WEBAPP_URL;
        
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: '🎵 Нажми кнопку чтобы заказать песню!',
                reply_markup: {
                    inline_keyboard: [[{
                        text: '🎸 Заказать песню',
                        web_app: { url: webAppUrl }
                    }]]
                }
            })
        });
    }
    
    res.status(200).json({ ok: true });
};
