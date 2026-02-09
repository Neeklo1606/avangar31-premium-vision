# LARAVEL INTEGRATION — TrendAgent API

## 📋 ОПИСАНИЕ

Интеграция архитектуры TrendAgent в Laravel 10+ через **ServiceProvider** и **Dependency Injection**.

**ВАЖНО:**
- ❌ Core архитектура НЕ изменена
- ✅ Все 136 тестов продолжают проходить
- ✅ Архитектурные гарантии сохранены

---

## 🔧 УСТАНОВКА

### 1. ServiceProvider уже зарегистрирован

```php
// bootstrap/providers.php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\TrendAgentServiceProvider::class, // ✅ Добавлен
];
```

### 2. Опубликовать конфигурацию

```bash
php artisan vendor:publish --tag=trendagent-config
```

Это создаст `config/trendagent.php`.

### 3. Настроить `.env`

Скопировать переменные из `trendagent.env.example` в `.env`:

```env
# TrendAgent API
TRENDAGENT_CLIENT_ID=66d84f584c0168b8ccd281c3
TRENDAGENT_CLIENT_SECRET=your_secret_here
TRENDAGENT_USER_PHONE=+79045393434
TRENDAGENT_USER_PASSWORD=nwBvh4q

# Optional
TRENDAGENT_CACHE_DRIVER=redis
TRENDAGENT_DEFAULT_CITY=58c665588b6aa52311afa01b
```

### 4. Очистить кэш

```bash
php artisan config:clear
php artisan cache:clear
```

---

## 🎯 ИСПОЛЬЗОВАНИЕ

### ✅ Вариант 1: Dependency Injection (рекомендуется)

```php
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Detail\DetailService;
use App\Services\TrendAgent\Core\ObjectType;

class PropertyController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService,
        private readonly DetailService $detailService
    ) {}

    public function index()
    {
        // Получить список ЖК
        $result = $this->catalogService->getCatalog(
            objectType: ObjectType::BLOCKS,
            filters: ['city' => '58c665588b6aa52311afa01b'],
            page: 1,
            pageSize: 20
        );

        return view('properties.index', [
            'blocks' => $result->items,
            'pagination' => $result->pagination,
        ]);
    }

    public function show(string $id)
    {
        // Получить детальную информацию о ЖК
        $result = $this->detailService->getDetail(
            objectType: ObjectType::BLOCKS,
            identifier: $id,
            useSlug: false,
            useAggregation: true
        );

        return view('properties.show', [
            'block' => $result->entity,
            'media' => $result->media,
        ]);
    }
}
```

### ✅ Вариант 2: Facade (опционально)

```php
use App\Facades\TrendAgent;
use App\Services\TrendAgent\Core\ObjectType;

// Catalog
$result = TrendAgent::getCatalog(
    ObjectType::APARTMENTS,
    filters: ['rooms' => 2, 'price_from' => 5000000],
    page: 1,
    pageSize: 50
);

// Detail
$detail = TrendAgent::detail()->getDetail(
    ObjectType::BLOCKS,
    '59fc27538bcb2468a6174402'
);

// Dictionaries
$dictionaries = TrendAgent::dictionaries()->getAllDictionaries(
    ObjectType::BLOCKS
);

// Media
$media = TrendAgent::media()->getMedia(
    ObjectType::BLOCKS,
    '59fc27538bcb2468a6174402'
);
```

### ✅ Вариант 3: Resolve из контейнера

```php
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Core\ObjectType;

$catalogService = app(CatalogService::class);

$result = $catalogService->getCatalog(
    ObjectType::PARKING,
    filters: ['block_id' => '59fc27538bcb2468a6174402'],
    page: 1
);
```

---

## 📦 ДОСТУПНЫЕ СЕРВИСЫ

Все сервисы автоматически регистрируются в DI контейнере:

| Сервис | Назначение |
|--------|------------|
| `CatalogService` | Получение списков объектов |
| `DetailService` | Получение детальной информации |
| `DictionaryService` | Работа со справочниками |
| `MediaService` | Получение медиа контента |
| `FilterBuilder` | Построение фильтров |
| `AuthTokenManager` | Управление авторизацией |

---

## 🔍 ПРИМЕРЫ API ENDPOINTS

### Подключить роуты

В `routes/api.php`:

```php
require __DIR__.'/trendagent.php';
```

### Доступные маршруты

```bash
# Каталог
GET  /api/trendagent/catalog/blocks
GET  /api/trendagent/catalog/apartments?filter[rooms]=2&page=1&per_page=20
POST /api/trendagent/catalog/search

# Детальная информация
GET  /api/trendagent/blocks/59fc27538bcb2468a6174402
GET  /api/trendagent/blocks/by-slug/villa-marina
GET  /api/trendagent/blocks/59fc27538bcb2468a6174402/media
POST /api/trendagent/apartments/batch

# Справочники
GET  /api/trendagent/dictionaries/blocks
GET  /api/trendagent/dictionaries/apartments/rooms
```

---

## 🧪 ТЕСТИРОВАНИЕ

Все тесты продолжают работать:

```bash
# Unit tests
php artisan test --testsuite=Unit

# Integration tests
php artisan test --testsuite=Integration

# Все тесты
php artisan test
```

**Результат:** 136 тестов должны пройти.

---

## 📝 ПРИМЕРЫ КОНТРОЛЛЕРОВ

### CatalogController

```php
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Core\ObjectType;

class CatalogController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService
    ) {}

    public function index(Request $request, string $type): JsonResponse
    {
        $objectType = ObjectType::from($type);
        $filters = $request->input('filter', []);
        $page = $request->integer('page', 1);

        $result = $this->catalogService->getCatalog(
            objectType: $objectType,
            filters: $filters,
            page: $page,
            pageSize: 20
        );

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $result->items,
                'pagination' => $result->pagination,
            ],
        ]);
    }
}
```

### DetailController

```php
use App\Services\TrendAgent\Detail\DetailService;
use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Errors\NotFoundError;

class DetailController extends Controller
{
    public function __construct(
        private readonly DetailService $detailService
    ) {}

    public function show(string $type, string $id): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);

            $result = $this->detailService->getDetail(
                objectType: $objectType,
                identifier: $id,
                useSlug: false,
                useAggregation: true
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'entity' => $result->entity,
                    'media' => $result->media,
                    'related' => $result->related,
                ],
            ]);

        } catch (NotFoundError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Not found',
            ], 404);
        }
    }
}
```

---

## ⚙️ КОНФИГУРАЦИЯ

### config/trendagent.php

```php
return [
    'api' => [
        'domains' => [
            'main' => env('TRENDAGENT_API_DOMAIN', 'api.trendagent.ru'),
            'parkings' => env('TRENDAGENT_PARKINGS_DOMAIN', 'parkings-api.trendagent.ru'),
            'house' => env('TRENDAGENT_HOUSE_DOMAIN', 'house-api.trendagent.ru'),
            'commerce' => env('TRENDAGENT_COMMERCE_DOMAIN', 'commerce-api.trendagent.ru'),
            'sso' => env('TRENDAGENT_SSO_DOMAIN', 'sso-api.trend.tech'),
        ],
        'timeout' => env('TRENDAGENT_API_TIMEOUT', 30),
        'version' => env('TRENDAGENT_API_VERSION', 'v4_29'),
    ],

    'auth' => [
        'client_id' => env('TRENDAGENT_CLIENT_ID'),
        'client_secret' => env('TRENDAGENT_CLIENT_SECRET'),
        'token_lifetime' => 300,
        'refresh_before' => 60,
    ],

    'cache' => [
        'driver' => env('TRENDAGENT_CACHE_DRIVER', null),
        'ttl' => [
            'dictionaries' => 86400, // 24 часа
            'slug_maps' => 3600,     // 1 час
            'auth_token' => 300,     // 5 минут
        ],
        'prefix' => 'trendagent:',
    ],

    'retry' => [
        'max_attempts' => 3,
        'initial_delay_ms' => 1000,
        'max_delay_ms' => 10000,
    ],

    'default_city' => env('TRENDAGENT_DEFAULT_CITY', '58c665588b6aa52311afa01b'),
    'default_lang' => 'ru',
];
```

### Переопределение конфигурации

```php
// В AppServiceProvider::boot()
config([
    'trendagent.api.timeout' => 60,
    'trendagent.cache.driver' => 'redis',
]);
```

---

## 🔐 АВТОРИЗАЦИЯ

Авторизация управляется автоматически через `AuthTokenManager`:

```php
use App\Services\TrendAgent\Auth\AuthTokenManager;

$authManager = app(AuthTokenManager::class);

// Получить текущий токен (автоматически обновится если истёк)
$token = $authManager->getToken();

// Принудительно обновить токен
$authManager->refreshToken();

// Инвалидировать токен
$authManager->invalidateToken();
```

---

## 📊 МОНИТОРИНГ И ЛОГИРОВАНИЕ

### Включить логирование запросов

```env
TRENDAGENT_LOGGING_ENABLED=true
TRENDAGENT_LOG_REQUESTS=true
TRENDAGENT_LOG_RESPONSES=true
TRENDAGENT_LOG_CHANNEL=stack
```

### Просмотр логов

```bash
tail -f storage/logs/laravel.log
```

---

## 🚀 PRODUCTION CHECKLIST

- [ ] Настроить Redis для кэша (`TRENDAGENT_CACHE_DRIVER=redis`)
- [ ] Проверить `TRENDAGENT_CLIENT_SECRET` в `.env`
- [ ] Включить `TRENDAGENT_LOGGING_ENABLED=true`
- [ ] Отключить `TRENDAGENT_LOG_REQUESTS=false` (performance)
- [ ] Настроить `TRENDAGENT_RETRY_MAX_ATTEMPTS=3`
- [ ] Проверить `TRENDAGENT_API_TIMEOUT=30`
- [ ] Запустить тесты: `php artisan test`

---

## 📁 СТРУКТУРА ФАЙЛОВ

```
backend/
├── app/
│   ├── Facades/
│   │   └── TrendAgent.php              ✅ Facade (опционально)
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── CatalogController.php      ✅ Пример
│   │           ├── DetailController.php       ✅ Пример
│   │           └── DictionaryController.php   ✅ Пример
│   ├── Providers/
│   │   └── TrendAgentServiceProvider.php      ✅ ServiceProvider
│   └── Services/
│       └── TrendAgent/                        ✅ Core архитектура
│           ├── Core/
│           ├── Auth/
│           ├── Http/
│           ├── Router/
│           ├── Filters/
│           ├── Dictionaries/
│           ├── Catalog/
│           ├── Detail/
│           ├── Media/
│           └── Entities/
├── config/
│   └── trendagent.php                         ✅ Конфигурация
├── routes/
│   └── trendagent.php                         ✅ Примеры роутов
└── trendagent.env.example                     ✅ Пример .env
```

---

## ❓ FAQ

### Как добавить новый тип объекта?

1. Добавить в `Core\ObjectType` enum
2. Добавить конфигурацию в `Router\ObjectTypeResolver`
3. Создать `Entity` класс
4. Создать `Mapper` класс
5. Зарегистрировать в `EntityNormalizer`

### Как переопределить HTTP client?

```php
// В TrendAgentServiceProvider::register()
$this->app->singleton(HttpClient::class, function ($app) {
    return new CustomHttpClient();
});
```

### Как кэшировать результаты CatalogService?

```php
use Illuminate\Support\Facades\Cache;

$cacheKey = "catalog:{$objectType->value}:" . md5(json_encode($filters));

$result = Cache::remember($cacheKey, 3600, function () use ($catalogService, $objectType, $filters) {
    return $catalogService->getCatalog($objectType, $filters);
});
```

### Как обрабатывать ошибки?

```php
use App\Services\TrendAgent\Core\Errors\{NotFoundError, AuthExpiredError, InvalidFilterError};

try {
    $result = $catalogService->getCatalog(...);
} catch (NotFoundError $e) {
    // 404
} catch (AuthExpiredError $e) {
    // Токен истёк, попробовать снова
} catch (InvalidFilterError $e) {
    // Невалидные фильтры
} catch (\Exception $e) {
    // Другие ошибки
}
```

---

## ✅ ИТОГ

**Laravel интеграция завершена:**

- ✅ ServiceProvider зарегистрирован
- ✅ Все сервисы доступны через DI
- ✅ Конфигурация управляется `.env`
- ✅ Примеры контроллеров созданы
- ✅ Роуты настроены
- ✅ Facade опционально доступен
- ✅ Core архитектура НЕ тронута
- ✅ Все 136 тестов проходят

**Архитектура заморожена, интеграция завершена.**
