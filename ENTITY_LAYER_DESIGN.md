# Entity Layer Design — TrendAgent API

## Цель
Создать строго типизированный Entity слой для всех типов объектов TrendAgent API.

---

## Архитектурные принципы

### 1. Базовая иерархия

```
AbstractEntity (базовый абстрактный класс)
├── BlockEntity (ЖК)
├── ApartmentEntity (Квартиры)
├── ParkingEntity (Паркинги)
├── HouseEntity (Дома = расширение ApartmentEntity)
├── PlotEntity (Участки)
├── CommerceEntity (Коммерция)
├── HouseProjectEntity (Проекты домов)
└── VillageEntity (Поселки)
```

### 2. Общие поля (AbstractEntity)

Все сущности имеют:
- `id` (string) — первичный идентификатор (_id из API)
- `createdAt` (?DateTimeImmutable) — дата создания
- `updatedAt` (?DateTimeImmutable) — дата обновления
- `rawData` (array) — сырые данные API (для отладки/расширения)

### 3. Типизация

- Все поля строго типизированы
- Nullable только там, где API может не вернуть поле
- Value Objects для сложных типов (Price, Area, Location, Contact)
- Collections для списков

---

## Value Objects (вспомогательные)

### Price
```php
readonly class Price
{
    public function __construct(
        public float $value,
        public string $currency = 'RUB'
    ) {}
}
```

### Area
```php
readonly class Area
{
    public function __construct(
        public float $value,
        public string $unit = 'm²'
    ) {}
}
```

### Location
```php
readonly class Location
{
    public function __construct(
        public ?float $latitude,
        public ?float $longitude,
        public ?string $address,
        public ?string $district,
        public ?array $metro
    ) {}
}
```

### Contact
```php
readonly class Contact
{
    public function __construct(
        public ?string $phone,
        public ?string $email,
        public ?string $website
    ) {}
}
```

---

## Entity классы

### 1. BlockEntity (ЖК)

**Источник:** `GET /v4_29/blocks/{id}/unified/`

```php
readonly class BlockEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public string $name,
        public ?string $guid,
        public ?string $slug,
        public ?string $description,
        
        // Цена и характеристики
        public ?Price $priceFrom,
        public ?Price $priceTo,
        public ?Area $areaFrom,
        public ?Area $areaTo,
        
        // Локация
        public Location $location,
        
        // Статус и даты
        public ?string $status,
        public ?DateTimeImmutable $deadline,
        public ?string $developer,
        public ?string $class,
        
        // Характеристики
        public ?int $apartmentsCount,
        public ?int $buildingsCount,
        public ?int $floorsCount,
        
        // Контакты
        public ?Contact $contact,
        
        // Медиа
        public array $images,
        
        // Метаданные
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        array $rawData = []
    ) {
        parent::__construct($id, $createdAt, $updatedAt, $rawData);
    }
}
```

### 2. ApartmentEntity (Квартиры)

**Источник:** `GET /v4_29/apartments/{id}/`

```php
readonly class ApartmentEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public ?string $number,
        public int $rooms,
        public Area $area,
        public ?Area $kitchenArea,
        public ?Area $livingArea,
        
        // Расположение
        public int $floor,
        public ?int $floorsTotal,
        public ?string $section,
        
        // Цена
        public Price $price,
        public ?Price $pricePerMeter,
        
        // Привязка к ЖК
        public ?string $blockId,
        public ?string $blockName,
        public ?string $buildingId,
        
        // Планировка
        public ?string $layoutId,
        public ?string $layoutType,
        
        // Отделка
        public ?string $finishing,
        
        // Статус
        public ?string $status,
        public ?DateTimeImmutable $deadline,
        
        // Медиа
        public array $images,
        public array $floorPlans,
        
        // Метаданные
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        array $rawData = []
    ) {
        parent::__construct($id, $createdAt, $updatedAt, $rawData);
    }
}
```

### 3. ParkingEntity (Паркинги)

**Источник:** `GET parkings-api.trendagent.ru/parkings/{id}/`

```php
readonly class ParkingEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public ?string $number,
        public ?string $type, // underground, ground, multi-level
        public Area $area,
        
        // Цена
        public Price $price,
        
        // Расположение
        public ?int $floor,
        public ?string $section,
        
        // Привязка к ЖК
        public ?string $blockId,
        public ?string $blockName,
        
        // Характеристики
        public ?float $height,
        public ?string $status,
        
        // Локация
        public ?Location $location,
        
        // Метаданные
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        array $rawData = []
    ) {
        parent::__construct($id, $createdAt, $updatedAt, $rawData);
    }
}
```

### 4. HouseEntity (Дома)

**Примечание:** Houses — это apartments с room=30|40

```php
readonly class HouseEntity extends ApartmentEntity
{
    public function __construct(
        string $id,
        ?string $number,
        int $rooms,
        Area $area,
        ?Area $kitchenArea,
        ?Area $livingArea,
        int $floor,
        ?int $floorsTotal,
        ?string $section,
        Price $price,
        ?Price $pricePerMeter,
        ?string $blockId,
        ?string $blockName,
        ?string $buildingId,
        ?string $layoutId,
        ?string $layoutType,
        ?string $finishing,
        ?string $status,
        ?DateTimeImmutable $deadline,
        array $images,
        array $floorPlans,
        
        // Дополнительные поля для домов
        public ?string $houseType, // cottage | townhouse
        public ?Area $plotArea,
        public ?int $floorsInHouse,
        
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        array $rawData = []
    ) {
        parent::__construct(
            $id, $number, $rooms, $area, $kitchenArea, $livingArea,
            $floor, $floorsTotal, $section, $price, $pricePerMeter,
            $blockId, $blockName, $buildingId, $layoutId, $layoutType,
            $finishing, $status, $deadline, $images, $floorPlans,
            $createdAt, $updatedAt, $rawData
        );
    }
}
```

### 5. PlotEntity (Участки)

**Источник:** `GET house-api.trendagent.ru/v1/plots/{id}`

```php
readonly class PlotEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public ?string $number,
        public Area $area,
        
        // Цена
        public Price $price,
        public ?Price $pricePerSotka,
        
        // Привязка к поселку
        public ?string $villageId,
        public ?string $villageName,
        
        // Характеристики
        public ?string $category, // ИЖС, СНТ, ЛПХ
        public ?string $purpose,
        public array $communications, // electricity, water, gas, sewage
        
        // Локация
        public ?Location $location,
        
        // Статус
        public ?string $status,
        
        // Медиа
        public array $images,
        
        // Метаданные
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        array $rawData = []
    ) {
        parent::__construct($id, $createdAt, $updatedAt, $rawData);
    }
}
```

### 6. CommerceEntity (Коммерция)

**Источник:** `GET commerce-api.trendagent.ru/premises/{id}`

```php
readonly class CommerceEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public ?string $number,
        public ?string $type, // office, retail, warehouse, restaurant
        public Area $area,
        
        // Цена
        public Price $price,
        public ?Price $pricePerMeter,
        
        // Расположение
        public ?int $floor,
        public ?string $section,
        
        // Привязка к ЖК
        public ?string $blockId,
        public ?string $blockName,
        
        // Характеристики
        public ?string $finishing,
        public ?bool $separate_entrance,
        public ?float $ceiling_height,
        
        // Статус
        public ?string $status,
        
        // Локация
        public ?Location $location,
        
        // Медиа
        public array $images,
        public array $floorPlans,
        
        // Метаданные
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        array $rawData = []
    ) {
        parent::__construct($id, $createdAt, $updatedAt, $rawData);
    }
}
```

### 7. HouseProjectEntity (Проекты домов)

**Источник:** `GET house-api.trendagent.ru/v1/projects/{id}`

```php
readonly class HouseProjectEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public string $name,
        public ?string $slug,
        public ?string $description,
        
        // Характеристики
        public Area $area,
        public ?Area $livingArea,
        public ?int $floors,
        public ?int $rooms,
        public ?int $bedrooms,
        public ?int $bathrooms,
        
        // Технические данные
        public ?string $material, // brick, wood, concrete, frame
        public ?string $foundation,
        public ?string $roof,
        public ?string $walls,
        
        // Цена
        public ?Price $priceFrom,
        public ?string $contractor,
        public ?int $buildDuration, // дней
        
        // Медиа
        public array $images,
        public array $blueprints,
        public array $renders,
        
        // Метаданные
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        array $rawData = []
    ) {
        parent::__construct($id, $createdAt, $updatedAt, $rawData);
    }
}
```

### 8. VillageEntity (Поселки)

**Источник:** `GET house-api.trendagent.ru/v1/villages/{id}`

```php
readonly class VillageEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public string $name,
        public ?string $slug,
        public ?string $description,
        
        // Цены
        public ?Price $priceFrom,
        public ?Price $priceTo,
        
        // Характеристики
        public ?int $plotsCount,
        public ?Area $totalArea,
        public ?Area $plotAreaFrom,
        public ?Area $plotAreaTo,
        
        // Инфраструктура
        public array $infrastructure, // roads, electricity, water, gas
        public array $amenities, // school, shop, playground
        
        // Локация
        public Location $location,
        public ?int $distanceToCity, // км
        
        // Застройщик
        public ?string $developer,
        public ?Contact $contact,
        
        // Статус
        public ?string $status,
        
        // Медиа
        public array $images,
        public array $masterPlan,
        
        // Метаданные
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        array $rawData = []
    ) {
        parent::__construct($id, $createdAt, $updatedAt, $rawData);
    }
}
```

---

## EntityNormalizer Architecture

### Структура

```
EntityNormalizer (main class)
├── EntityFactory (creates Entity instances)
└── Mappers/ (mapping strategies)
    ├── AbstractMapper
    ├── BlockMapper
    ├── ApartmentMapper
    ├── ParkingMapper
    ├── HouseMapper
    ├── PlotMapper
    ├── CommerceMapper
    ├── HouseProjectMapper
    └── VillageMapper
```

### Workflow

```php
$normalizer = new EntityNormalizer($factory);

$entity = $normalizer->normalize(
    objectType: ObjectType::BLOCKS,
    data: $apiResponse
);

// Returns: BlockEntity instance
```

### Mapper Interface

```php
interface EntityMapper
{
    public function supports(ObjectType $objectType): bool;
    public function map(array $data): AbstractEntity;
}
```

---

## Интеграция с существующими сервисами

### CatalogResult Update

```php
// Было:
CatalogResult {
    items: array  // Raw arrays
}

// Станет:
CatalogResult<T extends AbstractEntity> {
    items: array<T>  // Typed entities
}
```

### DetailResult Update

```php
// Было:
DetailResult {
    entity: array  // Raw array
}

// Станет:
DetailResult<T extends AbstractEntity> {
    entity: T  // Typed entity
}
```

### CatalogService Update

```php
public function getCatalog(...): CatalogResult
{
    // ... existing code ...
    
    // Normalize items to entities
    $items = array_map(
        fn($item) => $this->entityNormalizer->normalize($objectType, $item),
        $normalized['items']
    );
    
    return new CatalogResult(
        items: $items,  // Now Entity[]
        // ...
    );
}
```

---

## Backwards Compatibility

### Опции

1. **Добавить методы toArray() в Entity:**
   ```php
   abstract class AbstractEntity
   {
       public function toArray(): array
       {
           return $this->rawData;
       }
   }
   ```

2. **Поддержать оба режима в сервисах:**
   ```php
   CatalogService::getCatalog(..., bool $asEntity = true)
   ```

3. **Migration period:**
   - Сначала добавить Entity support
   - Постепенно мигрировать consumers
   - Удалить legacy поддержку

---

## Validation

Entity валидация на уровне конструктора:

```php
readonly class Price
{
    public function __construct(
        public float $value,
        public string $currency = 'RUB'
    ) {
        if ($value < 0) {
            throw new \InvalidArgumentException('Price cannot be negative');
        }
    }
}
```

---

## Testing Strategy

1. **Unit tests для каждой Entity:**
   - fromArray() корректно маппит
   - Валидация работает
   - toArray() возвращает корректные данные

2. **Integration tests для EntityNormalizer:**
   - Правильно выбирает Mapper
   - Корректно нормализует все ObjectType

3. **E2E tests для сервисов:**
   - CatalogService возвращает Entity[]
   - DetailService возвращает Entity

---

## Implementation Order

1. ✅ **Value Objects** (Price, Area, Location, Contact)
2. ✅ **AbstractEntity**
3. ✅ **8 Entity классов**
4. ✅ **EntityMapper interface + implementations**
5. ✅ **EntityFactory**
6. ✅ **EntityNormalizer**
7. ✅ **Update CatalogService**
8. ✅ **Update DetailService**
9. ✅ **Tests**
10. ✅ **Documentation**

---

## Файловая структура

```
backend/app/Services/TrendAgent/
└── Entities/
    ├── AbstractEntity.php
    ├── ValueObjects/
    │   ├── Price.php
    │   ├── Area.php
    │   ├── Location.php
    │   └── Contact.php
    ├── BlockEntity.php
    ├── ApartmentEntity.php
    ├── ParkingEntity.php
    ├── HouseEntity.php
    ├── PlotEntity.php
    ├── CommerceEntity.php
    ├── HouseProjectEntity.php
    ├── VillageEntity.php
    ├── Mappers/
    │   ├── EntityMapper.php (interface)
    │   ├── AbstractMapper.php
    │   ├── BlockMapper.php
    │   ├── ApartmentMapper.php
    │   ├── ParkingMapper.php
    │   ├── HouseMapper.php
    │   ├── PlotMapper.php
    │   ├── CommerceMapper.php
    │   ├── HouseProjectMapper.php
    │   └── VillageMapper.php
    ├── EntityFactory.php
    └── EntityNormalizer.php
```

---

## Статус: ПРОЕКТИРОВАНИЕ ЗАВЕРШЕНО ✅

Готово к реализации.
