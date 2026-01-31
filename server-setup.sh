#!/bin/bash
# Скрипт настройки сервера для автодеплоя
# Выполнить на сервере: bash server-setup.sh

set -e

echo "=== Настройка Git-репозитория на сервере ==="
cd ~/game_bot/public_html

# Инициализация Git (если ещё не было)
if [ ! -d ".git" ]; then
    echo "Инициализация Git..."
    git init
    git remote add origin https://github.com/letoceiling-coder/template-avangard.git
else
    echo "Git уже инициализирован"
    # Проверяем remote
    if ! git remote | grep -q origin; then
        git remote add origin https://github.com/letoceiling-coder/template-avangard.git
    fi
fi

echo ""
echo "=== Получение кода из GitHub ==="
git fetch origin

# Если есть локальные изменения, сохраняем их
if [ -n "$(git status --porcelain)" ]; then
    echo "Есть локальные изменения, создаём backup..."
    BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
    git add -A
    git commit -m "Backup before sync with GitHub"
    git branch "$BACKUP_BRANCH"
    echo "Backup создан в ветке: $BACKUP_BRANCH"
fi

# Переключаемся на main и синхронизируемся с GitHub
git checkout -B main origin/main

echo ""
echo "=== Проверка deploy.php ==="
if [ -f "deploy.php" ]; then
    echo "✓ deploy.php найден"
    echo ""
    echo "ВАЖНО: Проверьте токен в deploy.php:"
    grep "DEPLOY_TOKEN" deploy.php | head -n 1
    echo ""
    echo "Измените токен на свой секретный (если ещё не сделали):"
    echo "nano deploy.php"
else
    echo "✗ deploy.php не найден"
    echo "Загрузите его на сервер вручную или через scp"
fi

echo ""
echo "=== Проверка прав доступа ==="
ls -la .git/config
echo ""
echo "Если Git требует авторизацию при pull, настройте:"
echo "git config credential.helper store"
echo "Затем выполните git pull один раз вручную и введите токен"

echo ""
echo "=== Готово! ==="
echo ""
echo "Для проверки webhook выполните:"
echo "curl 'https://bot.siteaccess.ru/deploy.php?token=ВАШ_ТОКЕН'"
echo ""
echo "Или откройте в браузере:"
echo "https://bot.siteaccess.ru/deploy.php?token=ВАШ_ТОКЕН"
