# Boost Marketplace - Telegram Boost Votes Marketplace

Маркетплейс для голосов Telegram Boost с токенами BOOST (офчейн версия).

## Архитектура проекта

- **Telegram Bot** - управление каналами и заявками
- **Mini App** - веб-интерфейс для пользователей
- **Backend API** - связь с Telegram API и управление токенами BOOST (офчейн)

## Функционал

### Для пользователей:
- Отдача голосов каналам через Mini App
- Получение токенов BOOST с вестингом (1 голос = 1 BOOST)
- Отображение цены в долларах
- Вывод токенов в любой момент

### Для владельцев каналов:
- Добавление бота в канал
- Создание заявок на голоса (количество, канал, срок)
- Оплата токенами BOOST (1 токен = 1 голос)
- Получение голосов от пользователей

## Технологии

- **Bot**: Node.js + Telegraf
- **Mini App**: Next.js + React
- **Backend**: Node.js + Express
- **База данных**: JSON файлы (можно заменить на MongoDB/PostgreSQL)

## Установка и запуск

### 1. Установка зависимостей

```bash
# Установка зависимостей для всех модулей
npm install
cd bot && npm install
cd ../backend && npm install
cd ../mini-app && npm install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env` и заполните необходимые переменные:

```bash
cp .env.example .env
```

Заполните:
- `BOT_TOKEN` - токен Telegram бота от @BotFather
- `PORT` - порт для backend (по умолчанию 3000)
- `NEXT_PUBLIC_API_URL` - URL backend API

### 3. Запуск

```bash
# Запуск всех сервисов одновременно
npm run dev

# Или по отдельности:
npm run dev:bot      # Telegram Bot
npm run dev:backend  # Backend API
npm run dev:app      # Mini App (Next.js)
```

## Структура проекта

```
boost-marketplace/
├── bot/                # Telegram Bot
│   └── src/
│       ├── handlers/  # Обработчики команд
│       └── index.ts   # Точка входа
├── backend/            # Backend API
│   └── src/
│       ├── routes/    # API маршруты
│       ├── services/  # Бизнес-логика
│       ├── models/    # Модели данных
│       └── index.ts   # Точка входа
└── mini-app/           # Telegram Mini App
    ├── app/           # Next.js App Router
    ├── components/    # React компоненты
    └── lib/           # Утилиты
```

## Как это работает

### Офчейн токены BOOST

Токены BOOST хранятся в базе данных (JSON файлы) на backend:
- При голосовании пользователь получает токены с вестингом
- 1 голос = 1 BOOST токен
- Токены блокируются до окончания срока голосов
- После разблокировки пользователь может вывести токены

### Поток работы

1. **Владелец канала:**
   - Добавляет бота в канал
   - Создает заявку через `/create` или Mini App
   - Переводит BOOST токены (1 токен = 1 голос)

2. **Пользователь:**
   - Открывает Mini App
   - Просматривает активные заявки
   - Голосует за канал
   - Получает BOOST токены с вестингом
   - Выводит токены после разблокировки

## API Endpoints

- `GET /api/requests` - список активных заявок
- `GET /api/requests/:id` - информация о заявке
- `POST /api/requests` - создание заявки
- `GET /api/vesting/:userId` - информация о вестинге пользователя
- `POST /api/vesting/:userId/withdraw` - вывод токенов
- `GET /api/price/boost` - цена BOOST в USD

## Деплой

1. Настройка Telegram Bot через @BotFather
2. Настройка Mini App URL в @BotFather
3. Деплой Backend (Heroku, Railway, Vercel)
4. Деплой Mini App (Vercel, Netlify)
5. Настройка переменных окружения

## Лицензия

MIT
