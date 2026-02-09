<?php
/**
 * One-off: test SSO login and print response. Run: php scripts/sso_test.php (from backend dir)
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$baseUrl = 'https://' . config('trendagent.api.domains.sso', 'sso-api.trend.tech');
$phone = config('trendagent.auth.user_phone', '');
$password = config('trendagent.auth.user_password', '');
$clientId = config('trendagent.auth.client_id', '');
$clientSecret = config('trendagent.auth.client_secret', '');

echo "SSO base: $baseUrl\n";
echo "Has phone: " . (strlen($phone) ? 'yes' : 'no') . ", Has password: " . (strlen($password) ? 'yes' : 'no') . "\n";
echo "Has client_id: " . (strlen($clientId) ? 'yes' : 'no') . ", Has client_secret: " . (strlen($clientSecret) ? 'yes' : 'no') . "\n\n";

// Try POST /v1/login with phone + password
$r = Illuminate\Support\Facades\Http::timeout(15)->acceptJson()->post($baseUrl . '/v1/login', [
    'phone' => $phone,
    'password' => $password,
]);
echo "POST /v1/login (phone+password)\n";
echo "Status: " . $r->status() . "\n";
echo "Body: " . substr($r->body(), 0, 1200) . "\n\n";

if (!$r->successful()) {
    $r2 = Illuminate\Support\Facades\Http::timeout(15)->acceptJson()->post($baseUrl . '/v1/login', [
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
    ]);
    echo "POST /v1/login (client_id+client_secret)\n";
    echo "Status: " . $r2->status() . "\n";
    echo "Body: " . substr($r2->body(), 0, 1200) . "\n";
}
