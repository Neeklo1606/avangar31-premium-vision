# Проверка на сервере после деплоя

## Что делает deploy.php

1. **git pull** — подтягивает код из `origin main`
2. **backend:** `composer install --no-dev` — ставит PHP-зависимости
3. **backend:** `npm ci` — ставит Node-зависимости по `package-lock.json`
4. **backend:** `npm run build` — собирает Vue-админку (Vite), создаёт `backend/public/build/`

## Чеклист проверки на сервере

### 1. Код обновлён
```bash
cd /home/dsc23ytp/game_bot/public_html
git log -1 --oneline
# Должен быть коммит: Deploy: TrendAgent API, Vue Admin Panel...
```

### 2. Зависимости backend
```bash
cd backend
# PHP
ls vendor/autoload.php   # есть
# Node (не обязаны быть в репо, т.к. ставятся при деплое)
ls node_modules/vue/package.json   # есть после deploy
```

### 3. Сборка Vue (админка)
```bash
ls backend/public/build/assets/*.js
ls backend/public/build/assets/*.css
# Должны быть скомпилированные файлы
```

### 4. Laravel (если точка входа — backend)
```bash
cd backend
php artisan route:list | head -30
# Должны быть маршруты /admin, /api/trendagent/...
```

### 5. Проверка в браузере

| URL | Ожидание |
|-----|----------|
| https://bot.siteaccess.ru/ | Главная сайта |
| https://bot.siteaccess.ru/backend/public/ | Если Laravel в подпапке — возможно нужна настройка веб-сервера |
| https://bot.siteaccess.ru/admin | Vue-админка (если маршрут настроен на backend) |

**Важно:** Итоговый URL админки зависит от того, как на сервере настроен document root (корень проекта или `backend/public`). При необходимости настройте виртуальный хост или симлинк.

### 6. API TrendAgent (если доступен)
```bash
curl -s "https://bot.siteaccess.ru/api/trendagent/dictionaries?object_type=blocks" | head -200
# Ожидание: JSON (или 401/500 если нет .env с TRENDAGENT_*)
```

## Ручной запуск шагов деплоя на сервере

Если webhook не отработал или нужно пересобрать без push:

```bash
cd /home/dsc23ytp/game_bot/public_html
git pull origin main

cd backend
composer install --no-dev --prefer-dist --no-interaction
npm ci
npm run build
```

## Устранение проблем

- **500 Internal Server Error на /admin**
  - **vendor/autoload.php missing** — выполните в `backend/`: `composer install --no-dev --prefer-dist --no-interaction`
  - **Database file ... does not exist** (SQLite для сессий) — в `backend/.env` установите `SESSION_DRIVER=file` (вместо `database`), затем `php artisan config:clear`
  - **No application encryption key** — выполните `php artisan key:generate --force` в `backend/`
  - Убедитесь, что есть `backend/.env` (скопируйте из `.env.example` при необходимости) и созданы каталоги `storage/logs`, `storage/framework/cache`, `storage/framework/sessions`, `storage/framework/views`, `bootstrap/cache` с правами 775.
- **composer: command not found** — установите PHP Composer или запускайте через `php composer.phar`
- **npm: command not found** — установите Node.js и npm на сервере
- **npm run build падает** — проверьте версию Node (нужна 18+), выполните `npm ci` и снова `npm run build`
- **403 на /admin** — проверьте права на файлы и настройки веб-сервера (document root, rewrite)
