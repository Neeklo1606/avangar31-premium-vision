<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Core\ObjectType;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Проверка получения данных с trendagent.ru (для запуска на сервере).
 * Пример: php artisan trendagent:test [parking|blocks|plots]
 */
Artisan::command('trendagent:test {type=parking}', function (string $type) {
    $city = config('trendagent.default_city', '58c665588b6aa52311afa01b');

    $this->info("TrendAgent API test: type={$type}, city={$city}");
    $this->newLine();

    try {
        $objectType = ObjectType::from($type);
    } catch (\ValueError $e) {
        $this->error("Unknown type: {$type}. Use: " . implode(', ', array_column(ObjectType::cases(), 'value')));
        return 1;
    }

    try {
        $catalog = app(CatalogService::class);
        $result = $catalog->getCatalog($objectType, $city, null, 1, 5);

        $this->info('OK. HTTP request to trendagent.ru succeeded.');
        $this->line("Total: {$result->total}");
        $this->line('Items on page: ' . count($result->items));

        if (count($result->items) > 0) {
            $first = $result->items[0];
            $this->line('First item id: ' . ($first->id ?? 'n/a'));
        }

        $this->newLine();
        $this->info('Conclusion: API is reachable and returns data.');
        return 0;
    } catch (\Throwable $e) {
        $this->error('FAILED: ' . $e->getMessage());
        $this->line('File: ' . $e->getFile() . ':' . $e->getLine());
        $this->newLine();
        $this->warn('Check: .env TRENDAGENT_* vars, firewall, DNS. Parking/plots/commerce/villages do not require auth_token.');
        return 1;
    }
})->purpose('Test TrendAgent API connectivity and catalog fetch');

/**
 * Показать сырой ответ API trendagent.ru (для отладки формата при Total: 0).
 * Пример: php artisan trendagent:raw parking
 */
Artisan::command('trendagent:raw {type=parking}', function (string $type) {
    $city = config('trendagent.default_city', '58c665588b6aa52311afa01b');

    try {
        $objectType = ObjectType::from($type);
    } catch (\ValueError $e) {
        $this->error("Unknown type: {$type}");
        return 1;
    }

    $resolver = app(\App\Services\TrendAgent\Router\ObjectTypeResolver::class);
    $endpointBuilder = app(\App\Services\TrendAgent\Router\EndpointBuilder::class);
    $httpClient = app(\App\Services\TrendAgent\Http\HttpClient::class);

    $endpoint = $resolver->getCatalogEndpoint($objectType);
    $queryParams = ['offset' => 0, 'count' => 3, 'sort' => 'price', 'sort_order' => 'asc'];
    $url = $endpointBuilder->build($endpoint, [], $queryParams, $city);

    $this->line('URL: ' . $url);
    $this->newLine();

    $response = $httpClient->get($url);
    $this->line('HTTP status: ' . $response->status());
    $json = $response->json();

    if ($json === null) {
        $this->warn('Body (first 500 chars): ' . substr($response->body(), 0, 500));
        return 0;
    }

    $this->line('Top-level keys: ' . implode(', ', array_keys($json)));
    foreach (array_keys($json) as $key) {
        $v = $json[$key];
        if (is_array($v)) {
            $this->line("  [{$key}] array, length=" . count($v));
            if (count($v) > 0 && isset($v[0]) && is_array($v[0])) {
                $this->line('    first item keys: ' . implode(', ', array_keys($v[0])));
            }
        } else {
            $this->line("  [{$key}] = " . (is_scalar($v) ? $v : gettype($v)));
        }
    }

    $this->newLine();
    $this->line('Raw JSON (truncated 1500 chars):');
    $this->line(substr(json_encode($json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), 0, 1500) . '...');
    return 0;
})->purpose('Show raw TrendAgent API response to debug response format');
