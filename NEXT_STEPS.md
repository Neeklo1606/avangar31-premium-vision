# Дальнейшие действия

## ✓ Что уже сделано

На сервере:
- Git инициализирован
- Remote добавлен (GitHub)
- Создан backup: `backup-20260131-xxxxxx`
- Код из GitHub получен и синхронизирован

---

## Шаг 1. Загрузить deploy.php на сервер

**На локальной машине (PowerShell):**

```powershell
scp c:\OSPanel\domains\figma-trendagent\deploy.php dsc23ytp@dragon:~/game_bot/public_html/
```

Этот файл уже содержит токен: **`Lg2026_Deploy_SecureToken_98ba9f`**

---

## Шаг 2. Проверить webhook на сервере

**SSH на сервер:**

```bash
ssh dsc23ytp@dragon
cd ~/game_bot/public_html

# Проверить, что deploy.php загружен
ls -la deploy.php

# Проверить содержимое (опционально)
head -n 15 deploy.php | grep DEPLOY_TOKEN
```

Должен быть виден токен: `Lg2026_Deploy_SecureToken_98ba9f`

---

## Шаг 3. Проверить работу webhook

**На сервере или локально:**

```bash
curl "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"
```

**Ожидаемый результат:**

```
=== Git Pull ===
Already up to date.

Return code: 0

✓ Deployment successful!
Site updated: https://bot.siteaccess.ru/
```

Если видите это — webhook работает! ✓

---

## Шаг 4. Первый деплой с локальной машины

### Вариант A. Быстрый деплой (всё в одной команде)

**На локальной машине (Git Bash или PowerShell с Git):**

```bash
bash deploy.sh
```

Этот скрипт:
1. Соберёт проект (`npm run build`)
2. Закоммитит изменения
3. Запушит в GitHub
4. Вызовет webhook → сервер обновится автоматически

---

### Вариант B. Пошаговый деплой

```bash
# 1. Сборка проекта
npm run build

# 2. Коммит и push
git add -A
git commit -m "Deploy update"
git push origin main

# 3. Вызов webhook
curl "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"
```

---

### Вариант C. npm-команда

```bash
npm run deploy
```

Затем вызовите webhook вручную:

```bash
curl "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"
```

---

## Шаг 5. Проверить сайт

Откройте в браузере:

- **Главная:** https://bot.siteaccess.ru/
- **Каталог:** https://bot.siteaccess.ru/catalog
- **Карта:** https://bot.siteaccess.ru/map
- **Новости:** https://bot.siteaccess.ru/news

Все страницы должны загружаться (не 404) — это значит SPA routing работает.

---

## Полезные команды

### На сервере

```bash
# Подключиться
ssh dsc23ytp@dragon
cd ~/game_bot/public_html

# Обновить вручную
git pull origin main

# Проверить статус
git status

# Посмотреть последний коммит
git log -1

# Вызвать webhook вручную
curl "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"
```

### Локально

```bash
# Разработка (dev-сервер)
npm run dev

# Сборка
npm run build

# Деплой
bash deploy.sh
# ИЛИ
npm run deploy
```

---

## Безопасность

**Токен webhook:** `Lg2026_Deploy_SecureToken_98ba9f`

Не передавайте этот токен третьим лицам — любой, кто его знает, может вызвать webhook и обновить сайт.

Если токен скомпрометирован:
1. Измените его в `deploy.php` на сервере
2. Измените в `deploy.sh` локально
3. Загрузите новый `deploy.php` на сервер

---

## Устранение проблем

### Webhook возвращает «Access denied»

**Причина:** неправильный токен в URL.

**Решение:** проверьте токен в команде curl.

---

### Git pull на сервере требует пароль

**Причина:** credentials не сохранены.

**Решение:**

```bash
ssh dsc23ytp@dragon
cd ~/game_bot/public_html
git config credential.helper store
git pull origin main
# Введите GitHub логин и Personal Access Token один раз
```

---

### 404 на страницах /catalog, /map и т.д.

**Причина:** `.htaccess` не работает или неправильный.

**Решение:** проверьте `.htaccess` в корне проекта:

```bash
cat ~/game_bot/public_html/.htaccess
```

Должен содержать правила для SPA (перенаправление на `dist/index.html`).

---

### Сайт не обновляется после webhook

**Причина:** Git pull не выполнился или есть конфликты.

**Решение:** проверьте вручную на сервере:

```bash
ssh dsc23ytp@dragon
cd ~/game_bot/public_html
git status
git pull origin main
```

Если есть конфликты — разрешите их:

```bash
git reset --hard origin/main
```

---

## Готово!

Теперь деплой работает автоматически:

**Локально:** `bash deploy.sh`  
**Сервер:** автоматически обновляется через webhook

✓ Сайт обновлён: https://bot.siteaccess.ru/
