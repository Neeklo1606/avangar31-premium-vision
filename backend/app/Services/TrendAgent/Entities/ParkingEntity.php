<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area, Location};
use DateTimeImmutable;

/**
 * Entity: Машиноместо (Паркинг)
 * 
 * Источник: GET parkings-api.trendagent.ru/parkings/{id}/
 */
readonly class ParkingEntity extends AbstractEntity
{
    public function __construct(
        string $id,
        
        // Основная информация
        public ?string $number,
        public ?string $type,
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

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): static
    {
        $id = self::extractId($data);

        $price = Price::fromArray($data) 
            ?? throw new \InvalidArgumentException('Price is required for parking');

        $area = Area::fromArray($data) 
            ?? throw new \InvalidArgumentException('Area is required for parking');

        return new self(
            id: $id,
            number: $data['number'] ?? $data['place_number'] ?? null,
            type: $data['type'] ?? $data['parking_type'] ?? null,
            area: $area,
            
            price: $price,
            
            floor: isset($data['floor']) ? (int) $data['floor'] : null,
            section: $data['section'] ?? null,
            
            blockId: $data['block_id'] ?? $data['block'] ?? null,
            blockName: $data['block_name'] ?? null,
            
            height: isset($data['height']) ? (float) $data['height'] : null,
            status: $data['status'] ?? $data['state'] ?? null,
            
            location: isset($data['location']) || isset($data['address']) || isset($data['coordinates'])
                ? Location::fromArray($data)
                : null,
            
            createdAt: self::parseDate($data['created_at'] ?? null),
            updatedAt: self::parseDate($data['updated_at'] ?? null),
            rawData: $data
        );
    }

    /**
     * Получить название типа паркинга
     */
    public function getTypeLabel(): string
    {
        return match($this->type) {
            'underground' => 'Подземный',
            'ground' => 'Наземный',
            'multi-level' => 'Многоуровневый',
            default => $this->type ?? 'Неизвестно',
        };
    }
}
