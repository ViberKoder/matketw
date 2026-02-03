import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';
import { createRequestHandler } from './handlers/createRequest';
import { listRequestsHandler } from './handlers/listRequests';
import { helpHandler } from './handlers/help';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN is not set');
}

const bot = new Telegraf(BOT_TOKEN);

// Start command
bot.start((ctx: Context) => {
    ctx.reply(
        '👋 Добро пожаловать в Boost Marketplace!\n\n' +
        'Я помогу вам управлять заявками на голоса для вашего канала.\n\n' +
        'Доступные команды:\n' +
        '/create - Создать заявку на голоса\n' +
        '/list - Список активных заявок\n' +
        '/help - Помощь\n\n' +
        'Для пользователей: используйте Mini App для голосования за каналы.'
    );
});

// Help command
bot.command('help', helpHandler);

// Create request command
bot.command('create', createRequestHandler);

// List requests command
bot.command('list', listRequestsHandler);

// Handle new chat members (when bot is added to channel)
bot.on('new_chat_members', async (ctx: Context) => {
    if (ctx.message && 'new_chat_members' in ctx.message) {
        const members = ctx.message.new_chat_members;
        const botInfo = await bot.telegram.getMe();
        
        for (const member of members) {
            if (member.id === botInfo.id) {
                ctx.reply(
                    '✅ Бот успешно добавлен в канал!\n\n' +
                    'Теперь вы можете создавать заявки на голоса для этого канала.\n' +
                    'Используйте команду /create для создания заявки.'
                );
                break;
            }
        }
    }
});

// Error handling
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('Произошла ошибка. Попробуйте позже.');
});

// Launch bot
bot.launch().then(() => {
    console.log('🤖 Bot is running...');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
