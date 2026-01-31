# Обновление .htaccess на сервере

## Проблема

`deploy.php` находится в корне проекта, но `.htaccess` перенаправляет все запросы в `dist/`, поэтому webhook не работает.

## Решение

Добавить исключение для `deploy.php` в `.htaccess`.

---

## На сервере выполните:

```bash
cd ~/game_bot/public_html

# Создать резервную копию
cp .htaccess .htaccess.backup

# Отредактировать .htaccess
nano .htaccess
```

### Найдите эти строки (в начале секции RewriteRule):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Главная страница — отдаём dist/index.html
  RewriteRule ^$ dist/index.html [L]
```

### Добавьте ПЕРЕД строкой `# Главная страница`:

```apache
  # Исключение: deploy.php выполняется напрямую (не перенаправляем в dist/)
  RewriteRule ^deploy\.php$ - [L]
```

### Должно получиться:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Исключение: deploy.php выполняется напрямую (не перенаправляем в dist/)
  RewriteRule ^deploy\.php$ - [L]

  # Главная страница — отдаём dist/index.html
  RewriteRule ^$ dist/index.html [L]

  # ... остальные правила ...
```

### Сохраните:

`Ctrl+O`, Enter, `Ctrl+X`

---

## Или быстрая команда (замена всего файла):

```bash
cd ~/game_bot/public_html

cat > .htaccess << 'EOF'
# Сервер смотрит в корень проекта — отдаём сборку из папки dist/
# Сначала выполните: npm run build

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Исключение: deploy.php выполняется напрямую (не перенаправляем в dist/)
  RewriteRule ^deploy\.php$ - [L]

  # Главная страница — отдаём dist/index.html
  RewriteRule ^$ dist/index.html [L]

  # Файл или каталог есть в dist/ — отдаём из dist/
  RewriteCond %{DOCUMENT_ROOT}/dist%{REQUEST_URI} -f [OR]
  RewriteCond %{DOCUMENT_ROOT}/dist%{REQUEST_URI} -d
  RewriteRule ^(.*)$ dist/$1 [L]

  # Остальное (SPA: /catalog, /news и т.д.) — dist/index.html
  RewriteRule ^(.*)$ dist/index.html [L]
</IfModule>

# Кэш статики
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType text/css "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
</IfModule>

# Сжатие
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
EOF
```

---

## Проверка

После обновления `.htaccess` проверьте webhook:

```bash
curl "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"
```

**Правильный результат:**

```
=== Git Pull ===
Already up to date.

Return code: 0

✓ Deployment successful!
Site updated: https://bot.siteaccess.ru/
```

**Если всё ещё HTML:**
- Очистите кэш браузера: `Ctrl+Shift+R`
- Проверьте, что `.htaccess` обновлён: `cat .htaccess | head -n 15`

---

## Готово!

После исправления `.htaccess` webhook заработает, и вы сможете делать деплой командой:

```bash
bash deploy.sh
```
