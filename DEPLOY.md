# Инструкция по деплою

## Подготовка к деплою

### 1. Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите `BOT_TOKEN`
3. Настройте Mini App:
   ```
   /newapp
   Выберите вашего бота
   Укажите название: Boost Marketplace
   Укажите описание
   Загрузите иконку
   Укажите URL Mini App (после деплоя)
   ```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
BOT_TOKEN=your_bot_token_here
PORT=3000
NEXT_PUBLIC_API_URL=https://your-backend-url.com
DATA_DIR=./data
```

Для каждого модуля создайте свой `.env`:
- `bot/.env` - только BOT_TOKEN
- `backend/.env` - PORT, DATA_DIR
- `mini-app/.env.local` - NEXT_PUBLIC_API_URL

## Деплой Backend

### Вариант 1: Railway

1. Подключите GitHub репозиторий к Railway
2. Выберите папку `backend`
3. Установите переменные окружения
4. Railway автоматически задеплоит

### Вариант 2: Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set PORT=3000
heroku config:set DATA_DIR=/app/data
git push heroku main
```

### Вариант 3: VPS (Ubuntu)

```bash
# Установите Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Клонируйте репозиторий
git clone https://github.com/ViberKoder/matketw.git
cd matketw/backend

# Установите зависимости
npm install

# Создайте .env файл
nano .env

# Запустите через PM2
npm install -g pm2
pm2 start dist/index.js --name boost-backend
pm2 save
```

## Деплой Mini App

### Вариант 1: Vercel (рекомендуется)

1. Подключите GitHub репозиторий к Vercel
2. Выберите папку `mini-app`
3. Установите переменные окружения:
   - `NEXT_PUBLIC_API_URL` - URL вашего backend
4. Vercel автоматически задеплоит

### Вариант 2: Netlify

1. Подключите GitHub репозиторий к Netlify
2. Build command: `cd mini-app && npm run build`
3. Publish directory: `mini-app/.next`
4. Установите переменные окружения

## Деплой Bot

### Вариант 1: VPS

```bash
cd bot
npm install
npm run build
pm2 start dist/index.js --name boost-bot
pm2 save
```

### Вариант 2: Railway/Heroku

Аналогично backend, но выберите папку `bot`

## Обновление Mini App URL в BotFather

После деплоя Mini App:

1. Откройте [@BotFather](https://t.me/BotFather)
2. Выполните:
   ```
   /myapps
   Выберите ваше приложение
   Edit App
   Edit URL
   Введите URL вашего Mini App
   ```

## Проверка работы

1. Запустите бота: `/start`
2. Откройте Mini App через бота
3. Проверьте создание заявки
4. Проверьте голосование
5. Проверьте вывод токенов

## Мониторинг

Используйте PM2 для мониторинга:

```bash
pm2 list
pm2 logs boost-backend
pm2 logs boost-bot
pm2 monit
```

## Резервное копирование

Важные файлы для бэкапа:
- `backend/data/requests.json` - все заявки
- `backend/data/users.json` - все пользователи и токены

Настройте автоматический бэкап этих файлов!
