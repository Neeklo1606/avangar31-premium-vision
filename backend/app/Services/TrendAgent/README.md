# TrendAgent API Integration - Архитектура

## Обзор

Унифицированная архитектура для интеграции с TrendAgent API.

**Приоритеты:** Reliability > Speed > Code Quantity

---

## Структура слоёв

```
TrendAgent/
├── Core/                    # Базовые контракты и типы
│   ├── ObjectType.php       # Enum всех типов объектов
│   ├── ObjectTypeConfig.php # Конфигурация типа объекта
│   ├── Contracts/           # Унифицированные контракты
│   │   ├── CatalogResult.php
│   │   ├── DetailResult.php
│   │   ├── MediaCollection.php
│   │   ├── FilterSet.php
│   │   └── ApiEndpoint.php
│   └── Errors/              # Типизированные ошибки
│       ├── TrendAgentException.php
│       ├── AuthExpiredError.php
│       ├── InvalidFilterError.php
│       ├── NotFoundError.php
│       └── PartialAggregationError.php
│
├── Auth/                    # Управление токенами
│   └── AuthTokenManager.php
│
├── Http/                    # HTTP слой (БЕЗ бизнес-логики)
│   ├── HttpClient.php       # Низкоуровневый HTTP клиент
│   ├── RetryManager.php     # Retry логика
│   ├── ParallelExecutor.php # Параллельные запросы
│   └── ResponseNormalizer.php
│
├── Router/                  # Маршрутизация и endpoint'ы
│   ├── ObjectTypeResolver.php # Конфигурация всех API
│   └── EndpointBuilder.php    # Построение URL
│
├── Dictionaries/            # Справочники
│   ├── CacheManager.php
│   ├── DictionaryAdapter.php  # Нормализация 4 форматов
│   └── DictionaryService.php
│
├── Filters/                 # Фильтры
│   ├── FilterDefinition.php
│   ├── FilterRegistry.php     # Реестр всех фильтров
│   └── FilterBuilder.php      # Унифицированный построитель
│
├── Catalog/                 # Списки объектов
│   ├── PaginationManager.php
│   └── CatalogService.php     # ЕДИНЫЙ сервис для всех каталогов
│
├── Detail/                  # Детальная информация
│   ├── SlugResolver.php       # Slug → ID конвертация
│   ├── DetailAggregator.php   # Агрегация 22 endpoint'ов
│   ├── DetailService.php      # ЕДИНЫЙ сервис для всех деталей
│   └── Strategies/            # Стратегии агрегации
│       ├── DetailStrategy.php
│       └── BlockDetailStrategy.php
│
└── Media/                   # Медиа контент
    └── MediaService.php
```

---

## Ключевые принципы

### 1. Единый `ObjectType` для всех сущностей

```php
use App\Services\TrendAgent\Core\ObjectType;

ObjectType::BLOCKS        // Жилые комплексы (ЖК)
ObjectType::APARTMENTS    // Квартиры
ObjectType::PARKING       // Паркинги
ObjectType::HOUSES        // Дома (коттеджи + таунхаусы)
ObjectType::PLOTS         // Участки
ObjectType::COMMERCE      // Коммерческая недвижимость
ObjectType::HOUSE_PROJECTS // Проекты домов
ObjectType::VILLAGES      // Поселки
```

### 2. Унифицированные контракты ответов

```php
// Каталог
CatalogResult<T> {
    items: T[]
    total: int
    pagination: array
    appliedFilters: array
    meta: array
}

// Детали
DetailResult<T> {
    entity: T
    media: MediaCollection
    related: array
    dictionariesUsed: array
    meta: array
}
```

### 3. HTTP Boundary

- `HttpClient` — ТОЛЬКО HTTP запросы, БЕЗ бизнес-логики
- `RetryManager` — выше HttpClient
- `AuthTokenManager` — выше HttpClient
- `ResponseNormalizer` — выше HttpClient

### 4. Типизированные ошибки

- `AuthExpiredError` — токен истёк (retriable: true)
- `InvalidFilterError` — неверный фильтр (retriable: false)
- `NotFoundError` — объект не найден (retriable: false)
- `PartialAggregationError` — часть endpoint'ов упала (retriable: true, partial data available)

---

## Примеры использования

### 1. Получить список ЖК

```php
use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Catalog\CatalogService;

$catalogService = app(CatalogService::class);

$result = $catalogService->getCatalog(
    objectType: ObjectType::BLOCKS,
    city: '58c665588b6aa52311afa01b', // СПб
    page: 1,
    pageSize: 20,
    sort: 'price',
    sortOrder: 'asc'
);

echo "Всего ЖК: {$result->total}\n";
echo "На странице: {$result->getItemsCount()}\n";

foreach ($result->items as $block) {
    echo "- {$block['name']}\n";
}
```

### 2. Получить список с фильтрами

```php
use App\Services\TrendAgent\Filters\FilterBuilder;

$filterBuilder = app(FilterBuilder::class);

// Создать фильтры
$filters = $filterBuilder->create(ObjectType::APARTMENTS);
$filterBuilder->addFilter($filters, 'price', ['from' => 1000000, 'to' => 5000000]);
$filterBuilder->addFilter($filters, 'room', [1, 2, 3]);
$filterBuilder->addFilter($filters, 'district', ['центральный']);

// Получить каталог с фильтрами
$result = $catalogService->getCatalog(
    objectType: ObjectType::APARTMENTS,
    city: '58c665588b6aa52311afa01b',
    filters: $filters
);
```

### 3. Получить детали ЖК

```php
use App\Services\TrendAgent\Detail\DetailService;

$detailService = app(DetailService::class);

$detail = $detailService->getDetailBySlug(
    objectType: ObjectType::BLOCKS,
    slug: 'villa-marina',
    city: '58c665588b6aa52311afa01b'
);

echo "Название: {$detail->entity['name']}\n";
echo "Фото: {$detail->media->getTotalCount()}\n";
echo "Преимущества: " . count($detail->related['advantages']) . "\n";

// Проверить, все ли данные загружены
if (!$detail->isComplete()) {
    echo "Внимание: часть данных не загружена\n";
    print_r($detail->getFailedEndpoints());
}
```

### 4. Получить справочники

```php
use App\Services\TrendAgent\Dictionaries\DictionaryService;

$dictionaryService = app(DictionaryService::class);

$districts = $dictionaryService->getDictionary(
    objectType: ObjectType::APARTMENTS,
    dictionaryName: 'districts',
    city: '58c665588b6aa52311afa01b'
);

foreach ($districts['items'] as $district) {
    echo "- {$district['name']}\n";
}
```

### 5. Получить все квартиры (итератор)

```php
$totalProcessed = 0;

foreach ($catalogService->getAllPages(ObjectType::APARTMENTS, $city) as $page) {
    echo "Обработка страницы {$page->getCurrentPage()}/{$page->getTotalPages()}\n";
    
    foreach ($page->items as $apartment) {
        // Обработка квартиры
        processApartment($apartment);
        $totalProcessed++;
    }
}

echo "Всего обработано: {$totalProcessed} квартир\n";
```

---

## Добавление нового типа объекта

### Шаг 1: Добавить в ObjectType enum

```php
// Core/ObjectType.php
enum ObjectType: string
{
    // ...
    case NEW_TYPE = 'new_type';
}
```

### Шаг 2: Зарегистрировать конфигурацию

```php
// Router/ObjectTypeResolver.php
private function initializeConfigs(): void
{
    // ...
    
    $this->configs[ObjectType::NEW_TYPE->value] = new ObjectTypeConfig(
        apiDomain: 'new-api.trendagent.ru',
        apiVersion: 'v1',
        catalogEndpoint: new ApiEndpoint(
            domain: 'new-api.trendagent.ru',
            version: 'v1',
            path: '/new_type/search',
            requiredParams: ['city']
        ),
        detailEndpoint: new ApiEndpoint(
            domain: 'new-api.trendagent.ru',
            version: 'v1',
            path: '/new_type/{id}',
            pathParams: ['id']
        ),
        dictionariesEndpoint: null,
        dictionariesFormat: 'directories'
    );
}
```

### Шаг 3: Добавить фильтры (если нужны)

```php
// Filters/FilterRegistry.php
$this->register(new FilterDefinition(
    key: 'new_filter',
    type: 'select',
    label: 'Новый фильтр',
    objectTypes: ['new_type']
));
```

**ВСЁ!** Система автоматически поддержит новый тип.

---

## Замена API домена

Все API endpoint'ы находятся в `ObjectTypeResolver::initializeConfigs()`.

Для замены домена — достаточно изменить конфигурацию:

```php
// Было:
$this->configs[ObjectType::PARKING->value] = new ObjectTypeConfig(
    apiDomain: 'parkings-api.trendagent.ru',
    // ...
);

// Стало:
$this->configs[ObjectType::PARKING->value] = new ObjectTypeConfig(
    apiDomain: 'new-parkings-api.example.com',
    // ...
);
```

Никакой другой код менять НЕ нужно.

---

## Расширение агрегации

Для добавления новой стратегии агрегации:

### 1. Создать стратегию

```php
// Detail/Strategies/NewTypeStrategy.php
class NewTypeStrategy implements DetailStrategy
{
    public function getObjectType(): ObjectType
    {
        return ObjectType::NEW_TYPE;
    }

    public function getEndpoints(string $id, string $city): array
    {
        return [
            'main' => "https://api.example.com/items/{$id}",
            'media' => "https://api.example.com/items/{$id}/media",
        ];
    }

    public function aggregate(array $responses): array
    {
        return [
            'entity' => $responses['main'],
            'related' => [],
            'media' => $responses['media'],
        ];
    }
}
```

### 2. Зарегистрировать

```php
// В ServiceProvider
$aggregator = app(DetailAggregator::class);
$aggregator->registerStrategy(new NewTypeStrategy($endpointBuilder));
```

---

## Обработка ошибок

```php
use App\Services\TrendAgent\Core\Errors\*;

try {
    $result = $catalogService->getCatalog(...);
    
} catch (AuthExpiredError $e) {
    // Токен истёк — AuthTokenManager автоматически обновит
    // Retry произойдёт автоматически
    
} catch (InvalidFilterError $e) {
    // Неверный фильтр
    echo "Фильтр '{$e->getContext()['filter']}' невалиден\n";
    
} catch (NotFoundError $e) {
    // Объект не найден
    echo "Объект не найден: {$e->getMessage()}\n";
    
} catch (PartialAggregationError $e) {
    // Часть endpoint'ов упала, но есть частичные данные
    if ($e->hasPartialData()) {
        $data = $e->getSuccessfulResponses();
        echo "Загружены частичные данные\n";
        echo "Неудачные endpoint'ы: " . implode(', ', $e->getFailedEndpoints()) . "\n";
    }
}
```

---

## Кэширование

### Справочники

Кэшируются автоматически на **24 часа**.

```php
// Инвалидировать кэш справочников
$dictionaryService->invalidate(ObjectType::APARTMENTS, $city);
```

### Slug → ID маппинги

Кэшируются автоматически на **1 час**.

```php
// Прямое использование
$cacheManager = app(CacheManager::class);
$cacheManager->forgetAllSlugMaps();
```

---

## Параллельные запросы

Используются автоматически в:
- `DetailAggregator` — агрегация 22 endpoint'ов для ЖК
- `ParallelExecutor` — доступен для custom использования

```php
$parallelExecutor = app(ParallelExecutor::class);

$responses = $parallelExecutor->executeAllSettled([
    'blocks' => 'https://api.trendagent.ru/v4_29/blocks/search/',
    'apartments' => 'https://api.trendagent.ru/v4_29/apartments/search/',
]);

if ($parallelExecutor->allSuccessful($responses)) {
    // Все запросы успешны
} else {
    $failed = $parallelExecutor->getFailed($responses);
    // Обработка ошибок
}
```

---

## Тестирование

### Mock auth_token

```php
$authManager = app(AuthTokenManager::class);
$authManager->setToken('mock_token_for_testing', time() + 300);
```

### Mock HTTP ответы

```php
use Illuminate\Support\Facades\Http;

Http::fake([
    'api.trendagent.ru/*' => Http::response([
        'data' => [...],
        'total' => 100,
    ], 200),
]);
```

---

## Производительность

### Оптимизация каталогов

- **Пагинация:** используйте разумный `pageSize` (20-50)
- **Кэширование:** справочники кэшируются автоматически
- **Параллелизм:** детали ЖК загружаются параллельно

### Оптимизация деталей

- **Агрегация:** 22 endpoint'а выполняются параллельно
- **Partial errors:** система работает даже при частичных ошибках

---

## Архитектурные гарантии

✅ **ОДИН** `ObjectType` для всех сущностей  
✅ **ОДИН** `CatalogService` для всех каталогов  
✅ **ОДИН** `FilterBuilder` для всех фильтров  
✅ **ОДИН** `DetailService` для всех деталей  
✅ **ОДИН** `HttpClient` без бизнес-логики  
✅ Нормализованные `Entity` на выходе  
✅ Унифицированные контракты ответов  
✅ Типизированные ошибки  
✅ Retry логика  
✅ Auth token lifecycle  
✅ Кэширование справочников  
✅ Параллельные запросы  
✅ Агрегация множественных endpoint'ов  

---

## Лицензия

Proprietary
