<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area, Location, Contact};
use DateTimeImmutable;

/**
 * Entity: Жилой комплекс (ЖК)
 * 
 * Источник: GET /v4_29/blocks/{id}/unified/
 */
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

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): static
    {
        $id = self::extractId($data);

        return new self(
            id: $id,
            name: $data['name'] ?? $data['title'] ?? 'Unnamed Block',
            guid: $data['guid'] ?? null,
            slug: $data['slug'] ?? $data['guid'] ?? null,
            description: $data['description'] ?? $data['about'] ?? null,
            
            priceFrom: isset($data['price_from']) || isset($data['min_price']) 
                ? Price::fromArray(['price' => $data['price_from'] ?? $data['min_price']]) 
                : null,
            priceTo: isset($data['price_to']) || isset($data['max_price'])
                ? Price::fromArray(['price' => $data['price_to'] ?? $data['max_price']])
                : null,
            
            areaFrom: isset($data['area_from']) || isset($data['min_area'])
                ? Area::fromArray(['area' => $data['area_from'] ?? $data['min_area']])
                : null,
            areaTo: isset($data['area_to']) || isset($data['max_area'])
                ? Area::fromArray(['area' => $data['area_to'] ?? $data['max_area']])
                : null,
            
            location: Location::fromArray($data),
            
            status: $data['status'] ?? $data['state'] ?? null,
            deadline: self::parseDate($data['deadline'] ?? $data['completion_date'] ?? null),
            developer: $data['developer'] ?? $data['developer_name'] ?? null,
            class: $data['class'] ?? $data['housing_class'] ?? null,
            
            apartmentsCount: isset($data['apartments_count']) ? (int) $data['apartments_count'] : null,
            buildingsCount: isset($data['buildings_count']) ? (int) $data['buildings_count'] : null,
            floorsCount: isset($data['floors_count']) || isset($data['max_floor'])
                ? (int) ($data['floors_count'] ?? $data['max_floor'])
                : null,
            
            contact: isset($data['contact']) || isset($data['phone']) || isset($data['email'])
                ? Contact::fromArray($data['contact'] ?? $data)
                : null,
            
            images: $data['images'] ?? $data['photos'] ?? $data['gallery'] ?? [],
            
            createdAt: self::parseDate($data['created_at'] ?? $data['created'] ?? null),
            updatedAt: self::parseDate($data['updated_at'] ?? $data['updated'] ?? null),
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
     * Проверить, есть ли диапазон площадей
     */
    public function hasAreaRange(): bool
    {
        return $this->areaFrom !== null && $this->areaTo !== null;
    }

    /**
     * Получить статистику
     */
    public function getStats(): array
    {
        return [
            'apartments' => $this->apartmentsCount,
            'buildings' => $this->buildingsCount,
            'floors' => $this->floorsCount,
        ];
    }
}
