#!/bin/bash
# Скрипт быстрого деплоя: сборка → commit → push → триггер webhook на сервере

set -e

echo "=== Сборка проекта ==="
npm run build

echo ""
echo "=== Коммит изменений ==="
git add -A
git diff --cached --quiet || git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

echo ""
echo "=== Push в GitHub ==="
git push origin main

echo ""
echo "=== Триггер обновления на сервере ==="
# Вызываем webhook на сервере для автообновления
curl -s "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"

echo ""
echo ""
echo "✓ Деплой завершён! Сайт обновлён: https://bot.siteaccess.ru/"
