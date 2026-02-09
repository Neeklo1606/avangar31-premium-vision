<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area, Location, Contact};
use DateTimeImmutable;

/**
 * Entity: Поселок
 * 
 * Источник: GET house-api.trendagent.ru/v1/villages/{id}
 */
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
        public array $infrastructure,
        public array $amenities,
        
        // Локация
        public Location $location,
        public ?int $distanceToCity,
        
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

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): static
    {
        $id = self::extractId($data);

        return new self(
            id: $id,
            name: $data['name'] ?? $data['title'] ?? 'Unnamed Village',
            slug: $data['slug'] ?? null,
            description: $data['description'] ?? $data['about'] ?? null,
            
            priceFrom: Price::fromArray($data, 'price_from') ?? Price::fromArray($data, 'min_price'),
            priceTo: Price::fromArray($data, 'price_to') ?? Price::fromArray($data, 'max_price'),
            
            plotsCount: isset($data['plots_count']) ? (int) $data['plots_count'] : null,
            totalArea: Area::fromArray($data, 'total_area'),
            plotAreaFrom: Area::fromArray($data, 'plot_area_from') ?? Area::fromArray($data, 'min_plot_area'),
            plotAreaTo: Area::fromArray($data, 'plot_area_to') ?? Area::fromArray($data, 'max_plot_area'),
            
            infrastructure: $data['infrastructure'] ?? $data['utilities'] ?? [],
            amenities: $data['amenities'] ?? $data['facilities'] ?? [],
            
            location: Location::fromArray($data),
            distanceToCity: isset($data['distance_to_city']) ? (int) $data['distance_to_city'] : null,
            
            developer: $data['developer'] ?? $data['developer_name'] ?? null,
            contact: isset($data['contact']) || isset($data['phone'])
                ? Contact::fromArray($data['contact'] ?? $data)
                : null,
            
            status: $data['status'] ?? $data['state'] ?? null,
            
            images: $data['images'] ?? $data['photos'] ?? [],
            masterPlan: $data['master_plan'] ?? $data['plan'] ?? [],
            
            createdAt: self::parseDate($data['created_at'] ?? null),
            updatedAt: self::parseDate($data['updated_at'] ?? null),
            rawData: $data
        );
    }

    /**
     * Проверить, есть ли диапазон цен
     */
    public function hasPriceRange(): bool
    {
        return $this->priceFrom !== null && $this->priceTo !== null;
    }

    /**
     * Проверить, есть ли диапазон площадей участков
     */
    public function hasPlotAreaRange(): bool
    {
        return $this->plotAreaFrom !== null && $this->plotAreaTo !== null;
    }

    /**
     * Проверить наличие инфраструктуры
     */
    public function hasInfrastructure(string $type): bool
    {
        return in_array($type, $this->infrastructure, true);
    }

    /**
     * Проверить наличие удобства
     */
    public function hasAmenity(string $amenity): bool
    {
        return in_array($amenity, $this->amenities, true);
    }
}
