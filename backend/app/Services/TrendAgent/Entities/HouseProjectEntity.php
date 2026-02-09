<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area};
use DateTimeImmutable;

/**
 * Entity: Проект дома
 * 
 * Источник: GET house-api.trendagent.ru/v1/projects/{id}
 */
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
        public ?string $material,
        public ?string $foundation,
        public ?string $roof,
        public ?string $walls,
        
        // Цена
        public ?Price $priceFrom,
        public ?string $contractor,
        public ?int $buildDuration,
        
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

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): static
    {
        $id = self::extractId($data);

        $area = Area::fromArray($data) 
            ?? throw new \InvalidArgumentException('Area is required for house project');

        return new self(
            id: $id,
            name: $data['name'] ?? $data['title'] ?? 'Unnamed Project',
            slug: $data['slug'] ?? null,
            description: $data['description'] ?? $data['about'] ?? null,
            
            area: $area,
            livingArea: Area::fromArray($data, 'living_area'),
            floors: isset($data['floors']) ? (int) $data['floors'] : null,
            rooms: isset($data['rooms']) ? (int) $data['rooms'] : null,
            bedrooms: isset($data['bedrooms']) ? (int) $data['bedrooms'] : null,
            bathrooms: isset($data['bathrooms']) ? (int) $data['bathrooms'] : null,
            
            material: $data['material'] ?? $data['construction_material'] ?? null,
            foundation: $data['foundation'] ?? $data['foundation_type'] ?? null,
            roof: $data['roof'] ?? $data['roof_type'] ?? null,
            walls: $data['walls'] ?? $data['wall_material'] ?? null,
            
            priceFrom: Price::fromArray($data, 'price_from') ?? Price::fromArray($data, 'price'),
            contractor: $data['contractor'] ?? $data['builder'] ?? null,
            buildDuration: isset($data['build_duration']) ? (int) $data['build_duration'] : null,
            
            images: $data['images'] ?? $data['photos'] ?? [],
            blueprints: $data['blueprints'] ?? $data['floor_plans'] ?? [],
            renders: $data['renders'] ?? $data['3d_renders'] ?? [],
            
            createdAt: self::parseDate($data['created_at'] ?? null),
            updatedAt: self::parseDate($data['updated_at'] ?? null),
            rawData: $data
        );
    }

    /**
     * Получить название материала
     */
    public function getMaterialLabel(): string
    {
        return match($this->material) {
            'brick' => 'Кирпич',
            'wood' => 'Дерево',
            'concrete' => 'Бетон',
            'frame' => 'Каркас',
            default => $this->material ?? 'Неизвестно',
        };
    }

    /**
     * Получить характеристики проекта
     */
    public function getSpecs(): array
    {
        return [
            'area' => $this->area->format(),
            'floors' => $this->floors,
            'rooms' => $this->rooms,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'material' => $this->getMaterialLabel(),
        ];
    }
}
