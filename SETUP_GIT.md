# Настройка Git и первый push

## 1. Авторизация GitHub (один раз)

Git push требует авторизации. Настройте один из вариантов:

### Вариант A. Personal Access Token (PAT)

1. Откройте GitHub: https://github.com/settings/tokens
2. Создайте токен: **Generate new token (classic)** → выберите `repo` (full control) → Generate
3. Скопируйте токен (сохраните, он больше не покажется)
4. При `git push` введите:
   - Username: ваш GitHub-логин
   - Password: **токен** (не пароль аккаунта)

Чтобы не вводить каждый раз:
```bash
git config credential.helper store
```
Тогда Git сохранит токен после первого ввода.

### Вариант B. SSH (рекомендуется)

1. Сгенерируйте SSH-ключ (если нет):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. Добавьте ключ на GitHub: Settings → SSH and GPG keys → New SSH key → вставьте содержимое `~/.ssh/id_ed25519.pub`
3. Измените remote на SSH:
   ```bash
   git remote set-url origin git@github.com:letoceiling-coder/template-avangard.git
   ```

---

## 2. Первый push (вручную)

```bash
cd c:\OSPanel\domains\figma-trendagent
git push -u origin main
```

При запросе логина/пароля — введите GitHub-логин и **Personal Access Token** (см. выше).

---

## 3. Деплой в будущем (автоматически)

После успешного первого push используйте команду:

```bash
npm run deploy
```

ИЛИ (с автоматическим webhook):

```bash
bash deploy.sh
```

---

## 4. Настройка на сервере

### 4.1. Инициализация Git на сервере

SSH на сервер:
```bash
ssh dsc23ytp@dragon
cd ~/game_bot/public_html
```

Если там ещё нет Git:
```bash
git init
git remote add origin https://github.com/letoceiling-coder/template-avangard.git
git fetch origin
git reset --hard origin/main
```

Или, если репозиторий пустой, клонируйте:
```bash
cd ~/game_bot
rm -rf public_html  # ВНИМАНИЕ: удалит текущие файлы
git clone https://github.com/letoceiling-coder/template-avangard.git public_html
cd public_html
```

### 4.2. Загрузить webhook

Скопируйте файл **`deploy.php`** из проекта на сервер в **`~/game_bot/public_html/deploy.php`**.

Через SCP:
```bash
scp deploy.php dsc23ytp@dragon:~/game_bot/public_html/
```

Или через SFTP/FileZilla.

**Важно:** в `deploy.php` измените токен (строка `define('DEPLOY_TOKEN', '...')`) на свой секретный.

### 4.3. Проверка webhook

После загрузки `deploy.php` вызовите его в браузере:
```
https://bot.siteaccess.ru/deploy.php?token=ВАШ_ТОКЕН
```

Должен вернуться лог `git pull`. Если «Deployment successful» — всё работает.

---

## 5. Быстрый деплой (каждый раз)

**Локально:**
```bash
npm run deploy
```

**Затем (если не используете deploy.sh с webhook):**
```bash
curl "https://bot.siteaccess.ru/deploy.php?token=ВАШ_ТОКЕН"
```

**ИЛИ** используйте `bash deploy.sh` — он вызовет webhook автоматически.

---

## Устранение проблем

**1. Git push висит / ждёт ввода:**
- Нужна авторизация GitHub (токен или SSH). См. раздел 1.

**2. Webhook возвращает ошибку:**
- Проверьте токен в URL.
- Убедитесь, что на сервере Git-репозиторий инициализирован (см. 4.1).
- Проверьте права: пользователь веб-сервера должен иметь права на запись в `~/game_bot/public_html`.

**3. Сайт не обновляется:**
- Очистите кэш браузера: Ctrl+Shift+R.
- Проверьте, что `.htaccess` в корне проекта (не в dist) настроен корректно.
