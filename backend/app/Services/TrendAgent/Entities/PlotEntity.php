<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area, Location};
use DateTimeImmutable;

/**
 * Entity: Участок
 * 
 * Источник: GET house-api.trendagent.ru/v1/plots/{id}
 */
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
        public ?string $category,
        public ?string $purpose,
        public array $communications,
        
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

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): static
    {
        $id = self::extractId($data);

        $price = Price::fromArray($data) 
            ?? throw new \InvalidArgumentException('Price is required for plot');

        $area = Area::fromArray($data) 
            ?? throw new \InvalidArgumentException('Area is required for plot');

        return new self(
            id: $id,
            number: $data['number'] ?? $data['plot_number'] ?? null,
            area: $area,
            
            price: $price,
            pricePerSotka: Price::fromArray($data, 'price_per_sotka') 
                ?? Price::fromArray($data, 'price_per_hundred'),
            
            villageId: $data['village_id'] ?? $data['village'] ?? null,
            villageName: $data['village_name'] ?? null,
            
            category: $data['category'] ?? $data['land_category'] ?? null,
            purpose: $data['purpose'] ?? $data['land_purpose'] ?? null,
            communications: $data['communications'] ?? $data['utilities'] ?? [],
            
            location: isset($data['location']) || isset($data['address']) || isset($data['coordinates'])
                ? Location::fromArray($data)
                : null,
            
            status: $data['status'] ?? $data['state'] ?? null,
            
            images: $data['images'] ?? $data['photos'] ?? [],
            
            createdAt: self::parseDate($data['created_at'] ?? null),
            updatedAt: self::parseDate($data['updated_at'] ?? null),
            rawData: $data
        );
    }

    /**
     * Проверить, есть ли коммуникация
     */
    public function hasCommunication(string $type): bool
    {
        return in_array($type, $this->communications, true);
    }

    /**
     * Получить все коммуникации в читаемом виде
     */
    public function getCommunicationsLabels(): array
    {
        $labels = [
            'electricity' => 'Электричество',
            'water' => 'Водоснабжение',
            'gas' => 'Газ',
            'sewage' => 'Канализация',
        ];

        return array_map(
            fn($comm) => $labels[$comm] ?? $comm,
            $this->communications
        );
    }
}
