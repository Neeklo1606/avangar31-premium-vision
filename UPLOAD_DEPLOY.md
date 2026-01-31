# Как загрузить deploy.php на сервер

## Проблема

`scp` не находит хост `dragon` в PowerShell. Нужен полный адрес сервера.

---

## Решение 1. SSH + создание файла вручную

### Шаг 1. Подключитесь к серверу через SSH-клиент

Используйте тот SSH-клиент, которым обычно подключаетесь (PuTTY, MobaXterm, или другой).

**Адрес сервера:** найдите в панели хостинга (beget.com)  
**Логин:** `dsc23ytp`

### Шаг 2. На сервере создайте файл

```bash
cd ~/game_bot/public_html
nano deploy.php
```

### Шаг 3. Вставьте содержимое

Скопируйте весь код из `c:\OSPanel\domains\figma-trendagent\deploy.php` и вставьте в nano.

**Или используйте готовое содержимое ниже:**

```php
<?php
/**
 * Webhook для автообновления сайта из Git
 * Вызов: https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f
 */

// Секретный токен для безопасности webhook
define('DEPLOY_TOKEN', 'Lg2026_Deploy_SecureToken_98ba9f');

// Путь к проекту на сервере (корень сайта)
define('PROJECT_PATH', '/home/dsc23ytp/game_bot/public_html');

// Проверка токена
if (!isset($_GET['token']) || $_GET['token'] !== DEPLOY_TOKEN) {
    http_response_code(403);
    die('Access denied');
}

// Переходим в папку проекта
chdir(PROJECT_PATH);

// Выполняем git pull
$output = [];
$return_var = 0;
exec('git pull origin main 2>&1', $output, $return_var);

// Выводим результат
header('Content-Type: text/plain; charset=utf-8');
echo "=== Git Pull ===\n";
echo implode("\n", $output) . "\n";
echo "\nReturn code: $return_var\n";

if ($return_var === 0) {
    echo "\n✓ Deployment successful!\n";
    echo "Site updated: https://bot.siteaccess.ru/\n";
} else {
    echo "\n✗ Deployment failed. Check the output above.\n";
}
```

### Шаг 4. Сохраните файл

В nano: `Ctrl+O`, Enter, `Ctrl+X`

### Шаг 5. Проверьте права

```bash
chmod 644 deploy.php
ls -la deploy.php
```

---

## Решение 2. Через панель хостинга Beget

### Шаг 1. Войдите в панель управления

https://cp.beget.com/

### Шаг 2. Файловый менеджер

Найдите раздел "Файловый менеджер" или "FTP".

### Шаг 3. Перейдите в папку

`/home/dsc23ytp/game_bot/public_html`

### Шаг 4. Создайте новый файл

Имя: `deploy.php`

Содержимое: см. код выше (Решение 1, Шаг 3)

### Шаг 5. Сохраните

---

## Решение 3. Через FileZilla (SFTP)

### Шаг 1. Откройте FileZilla

Настройки подключения:
- **Протокол:** SFTP
- **Хост:** узнайте в панели Beget (обычно `siteXXX.beget.tech` или IP)
- **Порт:** 22
- **Логин:** `dsc23ytp`
- **Пароль:** ваш пароль от хостинга

### Шаг 2. Подключитесь

### Шаг 3. Загрузите файл

Локально: `c:\OSPanel\domains\figma-trendagent\deploy.php`  
На сервере: `/home/dsc23ytp/game_bot/public_html/deploy.php`

Перетащите файл в правую панель FileZilla.

---

## Решение 4. Найти правильный SSH-адрес для scp

### Шаг 1. Узнайте адрес сервера

В панели Beget найдите:
- **Вкладка "Сайты"** → информация о сайте → SSH-доступ
- Или **"FTP/SSH"** → адрес сервера

Обычно это:
- `siteXXX.beget.tech` (где XXX — номер сервера)
- Или IP-адрес: `123.45.67.89`

### Шаг 2. Используйте полный адрес в scp

```powershell
scp c:\OSPanel\domains\figma-trendagent\deploy.php dsc23ytp@ПОЛНЫЙ_АДРЕС_СЕРВЕРА:~/game_bot/public_html/
```

Пример:
```powershell
scp c:\OSPanel\domains\figma-trendagent\deploy.php dsc23ytp@site123.beget.tech:~/game_bot/public_html/
```

---

## После загрузки

Проверьте webhook:

```powershell
curl "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f"
```

**Правильный результат:**
```
=== Git Pull ===
Already up to date.

Return code: 0

✓ Deployment successful!
```

**Неправильный результат (HTML страница):**
- Файл не загружен или имя неправильное
- Проверьте на сервере: `ls -la ~/game_bot/public_html/deploy.php`

---

## Быстрый способ (рекомендуется)

**Подключитесь по SSH и создайте файл прямо там:**

```bash
# Ваш обычный SSH-клиент
ssh dsc23ytp@ВАШ_SSH_АДРЕС

# На сервере
cd ~/game_bot/public_html
cat > deploy.php << 'EOF'
<?php
define('DEPLOY_TOKEN', 'Lg2026_Deploy_SecureToken_98ba9f');
define('PROJECT_PATH', '/home/dsc23ytp/game_bot/public_html');

if (!isset($_GET['token']) || $_GET['token'] !== DEPLOY_TOKEN) {
    http_response_code(403);
    die('Access denied');
}

chdir(PROJECT_PATH);
$output = [];
$return_var = 0;
exec('git pull origin main 2>&1', $output, $return_var);

header('Content-Type: text/plain; charset=utf-8');
echo "=== Git Pull ===\n";
echo implode("\n", $output) . "\n";
echo "\nReturn code: $return_var\n";

if ($return_var === 0) {
    echo "\n✓ Deployment successful!\n";
    echo "Site updated: https://bot.siteaccess.ru/\n";
} else {
    echo "\n✗ Deployment failed. Check the output above.\n";
}
EOF

# Проверка
ls -la deploy.php
```

Теперь проверьте webhook!
