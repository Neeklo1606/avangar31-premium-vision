<?php
/**
 * Webhook для автообновления сайта из Git
 * Положите этот файл на сервер в ~/game_bot/public_html/deploy.php
 * После push на GitHub вызовите: https://bot.siteaccess.ru/deploy.php?token=ВАШ_СЕКРЕТ
 *
 * После git pull: устанавливает зависимости backend (composer, npm) и собирает Vue-админку.
 */

// Секретный токен для безопасности webhook
define('DEPLOY_TOKEN', 'Lg2026_Deploy_SecureToken_98ba9f');

// Путь к проекту на сервере (корень сайта)
define('PROJECT_PATH', '/home/dsc23ytp/game_bot/public_html');
define('BACKEND_PATH', PROJECT_PATH . '/backend');

// Проверка токена
if (!isset($_GET['token']) || $_GET['token'] !== DEPLOY_TOKEN) {
    http_response_code(403);
    die('Access denied');
}

header('Content-Type: text/plain; charset=utf-8');

$allOk = true;

// 1. Git pull
chdir(PROJECT_PATH);
$out = [];
exec('git pull origin main 2>&1', $out, $code);
echo "=== Git Pull ===\n" . implode("\n", $out) . "\nReturn code: $code\n\n";
if ($code !== 0) {
    $allOk = false;
}

// 2. Backend: composer install
if (is_dir(BACKEND_PATH)) {
    chdir(BACKEND_PATH);
    $out = [];
    exec('composer install --no-dev --prefer-dist --no-interaction 2>&1', $out, $code);
    echo "=== Backend: Composer install ===\n" . implode("\n", $out) . "\nReturn code: $code\n\n";
    if ($code !== 0) {
        $allOk = false;
    }

    // 3. Backend: npm install + build (Vue admin)
    $out = [];
    exec('npm ci --production=false 2>&1', $out, $code);
    echo "=== Backend: npm ci ===\n" . implode("\n", $out) . "\nReturn code: $code\n\n";
    if ($code !== 0) {
        $allOk = false;
    }
    $out = [];
    exec('npm run build 2>&1', $out, $code);
    echo "=== Backend: npm run build ===\n" . implode("\n", $out) . "\nReturn code: $code\n\n";
    if ($code !== 0) {
        $allOk = false;
    }
}

if ($allOk) {
    echo "✓ Deployment successful! Dependencies installed, project built.\n";
    echo "Site: https://bot.siteaccess.ru/\n";
} else {
    echo "✗ Deployment had errors. Check the output above.\n";
}
