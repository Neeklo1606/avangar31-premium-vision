<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area};
use DateTimeImmutable;

/**
 * Entity: Квартира
 * 
 * Источник: GET /v4_29/apartments/{id}/
 */
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

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): static
    {
        $id = self::extractId($data);

        // Цена
        $price = Price::fromArray($data) 
            ?? throw new \InvalidArgumentException('Price is required for apartment');

        // Площадь
        $area = Area::fromArray($data) 
            ?? throw new \InvalidArgumentException('Area is required for apartment');

        return new self(
            id: $id,
            number: $data['number'] ?? $data['apartment_number'] ?? null,
            rooms: (int) ($data['rooms'] ?? $data['room'] ?? $data['rooms_count'] ?? 0),
            area: $area,
            kitchenArea: Area::fromArray($data, 'kitchen_area'),
            livingArea: Area::fromArray($data, 'living_area'),
            
            floor: (int) ($data['floor'] ?? 0),
            floorsTotal: isset($data['floors_total']) || isset($data['total_floors'])
                ? (int) ($data['floors_total'] ?? $data['total_floors'])
                : null,
            section: $data['section'] ?? $data['section_number'] ?? null,
            
            price: $price,
            pricePerMeter: Price::fromArray($data, 'price_per_meter') 
                ?? Price::fromArray($data, 'price_m2'),
            
            blockId: $data['block_id'] ?? $data['block'] ?? null,
            blockName: $data['block_name'] ?? null,
            buildingId: $data['building_id'] ?? $data['building'] ?? null,
            
            layoutId: $data['layout_id'] ?? $data['layout'] ?? null,
            layoutType: $data['layout_type'] ?? null,
            
            finishing: $data['finishing'] ?? $data['finish'] ?? $data['decoration'] ?? null,
            
            status: $data['status'] ?? $data['state'] ?? null,
            deadline: self::parseDate($data['deadline'] ?? $data['completion_date'] ?? null),
            
            images: $data['images'] ?? $data['photos'] ?? [],
            floorPlans: $data['floor_plans'] ?? $data['plans'] ?? [],
            
            createdAt: self::parseDate($data['created_at'] ?? null),
            updatedAt: self::parseDate($data['updated_at'] ?? null),
            rawData: $data
        );
    }

    /**
     * Проверить, студия ли это
     */
    public function isStudio(): bool
    {
        return $this->rooms === 0;
    }

    /**
     * Получить название типа квартиры
     */
    public function getRoomsLabel(): string
    {
        if ($this->isStudio()) {
            return 'Студия';
        }

        return $this->rooms . '-комнатная';
    }
}
