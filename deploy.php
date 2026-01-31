<?php
/**
 * Webhook для автообновления сайта из Git
 * Положите этот файл на сервер в ~/game_bot/public_html/deploy.php
 * После push на GitHub вызовите: https://bot.siteaccess.ru/deploy.php?token=ВАШ_СЕКРЕТ
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
