# Команды для деплоя

## ✓ Webhook работает!

Проверено: https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f

---

## Варианты деплоя

### Вариант 1. PowerShell-скрипт (рекомендуется для Windows)

```powershell
.\deploy.ps1
```

Этот скрипт:
1. Соберёт проект (`npm run build`)
2. Закоммитит изменения в Git
3. Запушит в GitHub
4. Автоматически вызовет webhook → сервер обновится

---

### Вариант 2. Git Bash (если установлен Git for Windows)

Откройте **Git Bash** (не PowerShell) и выполните:

```bash
bash deploy.sh
```

Или найдите Git Bash в меню Пуск → Git → Git Bash.

---

### Вариант 3. Пошаговый деплой (вручную в PowerShell)

```powershell
# 1. Сборка
npm run build

# 2. Коммит и push
git add -A
git commit -m "Deploy update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main

# 3. Вызов webhook
curl "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"
```

---

### Вариант 4. npm-команда + webhook

```powershell
npm run deploy
```

Затем вызовите webhook:

```powershell
curl "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"
```

---

## Рекомендация

Используйте **PowerShell-скрипт** (Вариант 1):

```powershell
.\deploy.ps1
```

Это самый простой способ для Windows — одна команда делает всё автоматически!

---

## Первый деплой (проверка)

Попробуйте сейчас:

```powershell
.\deploy.ps1
```

Если всё работает, увидите:

```
=== Сборка проекта ===
...

=== Коммит изменений ===
✓ Изменения закоммичены

=== Push в GitHub ===
...

=== Триггер обновления на сервере ===
=== Git Pull ===
From https://github.com/letoceiling-coder/template-avangard
 * branch            main       -> FETCH_HEAD
Updating abc1234..def5678
Fast-forward
 ...

Return code: 0

✓ Deployment successful!
Site updated: https://bot.siteaccess.ru/

✓ Деплой завершён! Сайт обновлён: https://bot.siteaccess.ru/
```

---

## Устранение проблем

### PowerShell блокирует выполнение скриптов

Если при запуске `.\deploy.ps1` появляется ошибка:

```
Невозможно загрузить файл, так как выполнение сценариев отключено...
```

**Решение (один раз):**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Затем повторите `.\deploy.ps1`.

---

### Git требует авторизацию при push

При первом push Git может попросить логин/пароль.

**Введите:**
- Username: ваш GitHub-логин
- Password: **Personal Access Token** (не пароль аккаунта!)

**Создать токен:** https://github.com/settings/tokens → Generate new token (classic) → выберите `repo` → Generate

**Сохранить credentials (чтобы не вводить каждый раз):**

```powershell
git config credential.helper store
```

---

## В будущем

Каждый раз когда нужно обновить сайт, просто выполните:

```powershell
.\deploy.ps1
```

✓ Готово!
