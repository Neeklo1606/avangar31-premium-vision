# Настройка сервера для автодеплоя

Корень проекта на сервере: **`dsc23ytp@dragon:~/game_bot/public_html`**

---

## Шаг 1. Подключиться к серверу

```bash
ssh dsc23ytp@dragon
```

---

## Шаг 2. Перейти в корень проекта

```bash
cd ~/game_bot/public_html
```

---

## Шаг 3. Инициализировать Git и подключить GitHub

### 3.1. Инициализация Git (если ещё не сделано)

```bash
git init
```

### 3.2. Добавить remote на GitHub

```bash
git remote add origin https://github.com/letoceiling-coder/template-avangard.git
```

Если remote уже есть, проверьте:
```bash
git remote -v
```

Если URL неправильный, измените:
```bash
git remote set-url origin https://github.com/letoceiling-coder/template-avangard.git
```

---

## Шаг 4. Получить код из GitHub

### 4.1. Создать backup текущих файлов (если есть изменения)

```bash
git add -A
git commit -m "Backup before sync"
git branch backup-$(date +%Y%m%d-%H%M%S)
```

### 4.2. Получить код из GitHub

```bash
git fetch origin
git checkout -B main origin/main
```

Эта команда:
- Создаст ветку `main` (если нет)
- Переключится на неё
- Синхронизирует с `origin/main` из GitHub

---

## Шаг 5. Настроить webhook

### 5.1. Проверить, что deploy.php есть на сервере

```bash
ls -la deploy.php
```

Если файла нет, загрузите его с локальной машины:

**На локальной машине (PowerShell):**
```powershell
scp c:\OSPanel\domains\figma-trendagent\deploy.php dsc23ytp@dragon:~/game_bot/public_html/
```

### 5.2. Изменить токен в deploy.php

```bash
nano deploy.php
```

Найдите строку:
```php
define('DEPLOY_TOKEN', 'my-secret-deploy-token-2026');
```

Измените `my-secret-deploy-token-2026` на свой секретный токен (любую случайную строку).

Сохраните: `Ctrl+O`, Enter, `Ctrl+X`.

---

## Шаг 6. Настроить Git credentials (для git pull)

Если GitHub-репозиторий публичный, этот шаг не обязателен. Но если приватный или нужна авторизация:

```bash
git config credential.helper store
```

Затем выполните `git pull` один раз вручную:
```bash
git pull origin main
```

Git попросит логин и пароль/токен:
- Username: ваш GitHub-логин
- Password: **Personal Access Token** (создайте на https://github.com/settings/tokens)

Credentials сохранятся, и webhook будет работать без ввода.

---

## Шаг 7. Проверить webhook

### 7.1. Вызвать webhook вручную

**В браузере или через curl:**
```bash
curl "https://bot.siteaccess.ru/deploy.php?token=ВАШ_ТОКЕН"
```

Замените `ВАШ_ТОКЕН` на токен из `deploy.php`.

### 7.2. Ожидаемый результат

```
=== Git Pull ===
Already up to date.

Return code: 0

✓ Deployment successful!
Site updated: https://bot.siteaccess.ru/
```

Если видите это — всё работает!

---

## Шаг 8. Проверить, что .htaccess работает

### 8.1. Проверить файл .htaccess

```bash
cat .htaccess
```

Должен быть файл с правилами для SPA (перенаправление на `dist/index.html`).

### 8.2. Проверить сайт

Откройте: https://bot.siteaccess.ru/

Должна загрузиться главная страница React-приложения.

Попробуйте перейти на другие страницы:
- https://bot.siteaccess.ru/catalog
- https://bot.siteaccess.ru/map

Если страницы загружаются (не 404) — всё работает корректно.

---

## Быстрая настройка (все команды подряд)

```bash
# 1. Подключиться
ssh dsc23ytp@dragon

# 2. Перейти в проект
cd ~/game_bot/public_html

# 3. Инициализировать Git
git init
git remote add origin https://github.com/letoceiling-coder/template-avangard.git

# 4. Backup текущего состояния
git add -A
git commit -m "Backup before GitHub sync"
git branch backup-initial

# 5. Получить код из GitHub
git fetch origin
git checkout -B main origin/main

# 6. Настроить credentials (один раз)
git config credential.helper store
git pull origin main
# (Введите GitHub логин и Personal Access Token)

# 7. Проверить deploy.php
ls -la deploy.php
# Если есть — отредактируйте токен:
nano deploy.php

# 8. Проверить webhook
curl "https://bot.siteaccess.ru/deploy.php?token=ВАШ_ТОКЕН"

# 9. Проверить сайт
curl -I https://bot.siteaccess.ru/
```

---

## Устранение проблем

### Проблема: git pull требует пароль каждый раз

**Решение:**
```bash
git config credential.helper store
git pull origin main
# Введите токен один раз, сохранится
```

### Проблема: deploy.php возвращает ошибку «Permission denied»

**Решение:** дайте права на запись:
```bash
chmod -R 755 ~/game_bot/public_html
```

### Проблема: 404 на всех страницах кроме главной

**Решение:** проверьте `.htaccess` в корне:
```bash
cat ~/game_bot/public_html/.htaccess
```

Должен содержать правила для SPA (см. файл `.htaccess` в проекте).

### Проблема: webhook не выполняет git pull

**Решение:** проверьте логи Apache:
```bash
tail -f /var/log/apache2/error.log
```

Или выполните git pull вручную:
```bash
cd ~/game_bot/public_html
git pull origin main
```

Если есть ошибки — исправьте их, затем webhook заработает.

---

## После настройки

Теперь деплой работает так:

**Локально:**
```bash
npm run deploy
```

**Или (с автовызовом webhook):**
```bash
bash deploy.sh
```

**На сервере:** автоматически выполнится `git pull`, сайт обновится.

✓ Готово!
