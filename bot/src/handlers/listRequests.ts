import { Context } from 'telegraf';

export const listRequestsHandler = async (ctx: Context) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const miniAppUrl = `${apiUrl.replace('/api', '')}`;

    ctx.reply(
        '📋 Активные заявки на голоса\n\n' +
        'Список заявок доступен в Mini App:\n' +
        `${miniAppUrl}\n\n` +
        'Здесь вы можете:\n' +
        '• Просмотреть все активные заявки\n' +
        '• Проголосовать за каналы\n' +
        '• Отслеживать свои токены BOOST'
    );
};
