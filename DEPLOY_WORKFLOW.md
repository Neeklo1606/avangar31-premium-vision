# Автоматический деплой на сервер

Проект: **Live Grid** (React + Vite)  
Репозиторий: https://github.com/letoceiling-coder/template-avangard.git  
Сервер: https://bot.siteaccess.ru/ (SSH: dsc23ytp@dragon:~/game_bot/public_html)

---

## Настройка (один раз)

### 1. На локальной машине

Git уже настроен (remote добавлен).

**Первый push в GitHub:**
```bash
git add -A
git commit -m "Initial commit"
git push -u origin main
```

При первом push GitHub может попросить авторизацию:
- Либо Personal Access Token (Settings → Developer settings → Tokens)
- Либо SSH-ключ

---

### 2. На сервере (SSH: dsc23ytp@dragon)

#### 2.1. Если проект уже на сервере (файлы совпадают):

```bash
cd ~/game_bot/public_html
git init
git remote add origin https://github.com/letoceiling-coder/template-avangard.git
git add -A
git commit -m "Server initial commit"
git branch -M main
```

Теперь на сервере тоже есть Git с тем же remote.

#### 2.2. Загрузить webhook-скрипт на сервер:

Файл **`deploy.php`** из проекта положите в **`~/game_bot/public_html/deploy.php`** (рядом с `.htaccess`).

Сделайте его исполняемым (по желанию):
```bash
chmod +x ~/game_bot/public_html/deploy.php
```

**Важно:** в `deploy.php` задан токен `my-secret-deploy-token-2026` — **измените** его на свой (любая строка). Тот же токен укажите в `deploy.sh` (локально).

#### 2.3. Проверка webhook (вручную):

Откройте в браузере или вызовите curl:
```bash
curl "https://bot.siteaccess.ru/deploy.php?token=my-secret-deploy-token-2026"
```

Должен вернуться лог `git pull`. Если сайт обновился — всё работает.

---

## Использование (каждый раз)

### Вариант A. npm-команда (Windows/Mac/Linux)

```bash
npm run deploy
```

Выполнит: **сборка** → **commit** → **push** → push в GitHub.

**После этого** запустите на сервере (вручную по SSH или через webhook):
```bash
curl "https://bot.siteaccess.ru/deploy.php?token=my-secret-deploy-token-2026"
```

---

### Вариант B. Bash-скрипт (автоматический деплой + webhook)

Для Linux/Mac или Git Bash на Windows:

```bash
bash deploy.sh
```

Скрипт сделает:
1. `npm run build`
2. `git add -A && git commit`
3. `git push origin main`
4. `curl` на webhook → сервер автоматически сделает `git pull`

**Результат:** сайт обновится на https://bot.siteaccess.ru/ за одну команду.

---

### Вариант C. Только webhook (если уже запушили вручную)

Если вы уже сделали `git push` вручную, просто вызовите:

```bash
curl "https://bot.siteaccess.ru/deploy.php?token=my-secret-deploy-token-2026"
```

Сервер подтянет изменения из GitHub.

---

## Автоматизация (опционально)

### GitHub Actions (CI/CD)

Можно настроить GitHub Actions: при push автоматически вызывать webhook. Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Server
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger server webhook
        run: |
          curl "https://bot.siteaccess.ru/deploy.php?token=${{ secrets.DEPLOY_TOKEN }}"
```

В Secrets репозитория добавьте `DEPLOY_TOKEN` со значением токена.

---

## Безопасность

- **Токен в deploy.php:** используйте случайную строку (не `my-secret-deploy-token-2026`).
- **SSH-ключ для Git:** если на сервере нужно делать pull из приватного репозитория, добавьте SSH-ключ сервера в GitHub (Settings → Deploy keys).
- **Права на файлы:** deploy.php должен иметь права на запись (чтобы git pull работал).

---

## Устранение проблем

**1. Git pull не работает на сервере:**
- Убедитесь, что на сервере установлен git: `git --version`.
- Убедитесь, что папка `~/game_bot/public_html` — Git-репозиторий: `git status`.
- Проверьте права: пользователь веб-сервера (www-data/apache) должен иметь права на запись в папку.

**2. deploy.php возвращает ошибку:**
- Проверьте токен в URL.
- Проверьте логи Apache/PHP: `tail -f /var/log/apache2/error.log` (или путь к логу).
- Попробуйте вручную по SSH: `cd ~/game_bot/public_html && git pull origin main`.

**3. Изменения не появляются на сайте:**
- Проверьте, что `.htaccess` в корне проекта настроен правильно (см. DEPLOY.md).
- Очистите кэш браузера: Ctrl+Shift+R.

---

## Быстрая шпаргалка

**Локально (разработка + деплой):**
```bash
# Разработка
npm run dev

# Деплой
npm run deploy
# ИЛИ (для автовызова webhook):
bash deploy.sh
```

**На сервере (проверка обновления):**
```bash
ssh dsc23ytp@dragon
cd ~/game_bot/public_html
git pull origin main
```
