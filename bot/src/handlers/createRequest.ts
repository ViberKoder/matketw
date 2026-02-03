import { Context } from 'telegraf';

export const createRequestHandler = async (ctx: Context) => {
    if (!ctx.chat) {
        return ctx.reply('Эта команда доступна только в группах и каналах.');
    }

    const chatId = ctx.chat.id;
    const chatType = ctx.chat.type;

    if (chatType !== 'channel' && chatType !== 'supergroup') {
        return ctx.reply('Заявки можно создавать только для каналов и супергрупп.');
    }

    // Check if bot is admin
    try {
        const botMember = await ctx.telegram.getChatMember(chatId, ctx.botInfo.id);
        if (botMember.status !== 'administrator' && botMember.status !== 'creator') {
            return ctx.reply('Бот должен быть администратором канала для создания заявок.');
        }
    } catch (error) {
        return ctx.reply('Не удалось проверить права бота. Убедитесь, что бот добавлен в канал.');
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const miniAppUrl = `${apiUrl.replace('/api', '')}/create?channel=${chatId}`;

    ctx.reply(
        '📝 Создание заявки на голоса\n\n' +
        'Для создания заявки используйте Mini App:\n' +
        `${miniAppUrl}\n\n` +
        'В Mini App вы сможете:\n' +
        '• Указать количество нужных голосов\n' +
        '• Установить дедлайн\n' +
        '• Оплатить BOOST токенами (1 токен = 1 голос)'
    );
};
