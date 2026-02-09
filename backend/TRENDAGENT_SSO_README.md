# TrendAgent SSO и авторизация

## Реализация (по образцу проекта AL)

Авторизация приведена к формату, который используется в проекте AL и описан в `TRENDAGENT_FULL_AUTHENTICATION_DOCUMENTATION.md`:

1. **Логин по телефону и паролю (рекомендуется):**
   - URL: `POST https://sso-api.trend.tech/v1/login?app_id={app_id}&lang=ru`
   - Тело: `phone`, `password`, `client=web` (application/x-www-form-urlencoded)
   - Заголовки: `Origin: https://sso.trend.tech`, `Referer: https://sso.trend.tech/login?app_id=...`
   - Токен извлекается из: JSON (auth_token/token), Set-Cookie (auth_token), Location при редиректе 302.

2. **Запасной вариант:** `GET /v1/auth_token/?client_id=...&client_secret=...` или `POST /v1/login` с client_id+client_secret.

3. **EndpointBuilder** добавляет `auth_token` только к тем endpoint'ам, у которых он указан в `requiredParams`.

## Переменные .env

- **TRENDAGENT_PHONE** и **TRENDAGENT_PASSWORD** (или **TRENDAGENT_USER_PHONE** / **TRENDAGENT_USER_PASSWORD**) — для логина по телефону.
- **TRENDAGENT_APP_ID** (по умолчанию `66d84f584c0168b8ccd281c3`) — app_id в URL логина.
- **TRENDAGENT_CLIENT_ID** и **TRENDAGENT_CLIENT_SECRET** — запасной способ получения токена.

## Что сделать для появления данных

1. В **.env** задать:
   - **TRENDAGENT_PHONE** и **TRENDAGENT_PASSWORD** (как в проекте AL), либо TRENDAGENT_CLIENT_ID + TRENDAGENT_CLIENT_SECRET.
2. После сохранения .env выполнить:
   ```bash
   cd ~/game_bot/public_html/backend
   php artisan config:clear
   php artisan cache:clear
   php artisan trendagent:test parking
   ```
   При успешном получении токена в выводе будет `Total: N` (N > 0 при наличии данных).

## Проверка SSO вручную

На сервере:

```bash
cd ~/game_bot/public_html/backend
php scripts/sso_test.php
```

Скрипт выведет ответы SSO для логина по phone+password и по client_id+client_secret.
