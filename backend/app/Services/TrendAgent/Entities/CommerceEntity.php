<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area, Location};
use DateTimeImmutable;

/**
 * Entity: Коммерческая недвижимость
 * 
 * Источник: GET commerce-api.trendagent.ru/premises/{id}
 */
readonly class CommerceEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public ?string $number,
        public ?string $type,
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
        public ?bool $separateEntrance,
        public ?float $ceilingHeight,
        
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

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): static
    {
        $id = self::extractId($data);

        $price = Price::fromArray($data) 
            ?? throw new \InvalidArgumentException('Price is required for commerce');

        $area = Area::fromArray($data) 
            ?? throw new \InvalidArgumentException('Area is required for commerce');

        return new self(
            id: $id,
            number: $data['number'] ?? $data['premise_number'] ?? null,
            type: $data['type'] ?? $data['premise_type'] ?? null,
            area: $area,
            
            price: $price,
            pricePerMeter: Price::fromArray($data, 'price_per_meter'),
            
            floor: isset($data['floor']) ? (int) $data['floor'] : null,
            section: $data['section'] ?? null,
            
            blockId: $data['block_id'] ?? null,
            blockName: $data['block_name'] ?? null,
            
            finishing: $data['finishing'] ?? $data['finish'] ?? null,
            separateEntrance: isset($data['separate_entrance']) 
                ? (bool) $data['separate_entrance'] 
                : null,
            ceilingHeight: isset($data['ceiling_height']) 
                ? (float) $data['ceiling_height'] 
                : null,
            
            status: $data['status'] ?? null,
            
            location: isset($data['location']) || isset($data['address'])
                ? Location::fromArray($data)
                : null,
            
            images: $data['images'] ?? $data['photos'] ?? [],
            floorPlans: $data['floor_plans'] ?? $data['plans'] ?? [],
            
            createdAt: self::parseDate($data['created_at'] ?? null),
            updatedAt: self::parseDate($data['updated_at'] ?? null),
            rawData: $data
        );
    }

    /**
     * Получить название типа помещения
     */
    public function getTypeLabel(): string
    {
        return match($this->type) {
            'office' => 'Офис',
            'retail' => 'Торговое помещение',
            'warehouse' => 'Склад',
            'restaurant' => 'Ресторан',
            default => $this->type ?? 'Коммерческое помещение',
        };
    }
}
