# Инструкция по загрузке в GitHub

## Шаги для загрузки проекта в репозиторий

### 1. Инициализация Git (если еще не сделано)

```bash
cd C:\Users\leviv\boost-marketplace
git init
```

### 2. Добавление всех файлов

```bash
git add .
```

### 3. Первый коммит

```bash
git commit -m "Initial commit: Boost Marketplace project"
```

### 4. Подключение к удаленному репозиторию

```bash
git remote add origin https://github.com/ViberKoder/matketw.git
```

### 5. Проверка удаленного репозитория

```bash
git remote -v
```

### 6. Загрузка в GitHub

```bash
git branch -M main
git push -u origin main
```

## Если репозиторий уже существует

Если в репозитории уже есть файлы (например, README), выполните:

```bash
git pull origin main --allow-unrelated-histories
# Разрешите конфликты, если они есть
git add .
git commit -m "Merge with existing repository"
git push origin main
```

## Альтернативный способ через GitHub CLI

Если у вас установлен GitHub CLI:

```bash
gh repo create ViberKoder/matketw --public --source=. --remote=origin --push
```

## Проверка

После загрузки проверьте:
1. Все файлы загружены на GitHub
2. README отображается корректно
3. Структура проекта видна

## Дальнейшие обновления

Для обновления кода:

```bash
git add .
git commit -m "Описание изменений"
git push origin main
```
