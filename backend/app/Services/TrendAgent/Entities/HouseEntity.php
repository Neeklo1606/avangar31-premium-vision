<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area};
use DateTimeImmutable;

/**
 * Entity: Дом (Коттедж/Таунхаус)
 * 
 * Примечание: Houses — это apartments с room=30|40
 * Источник: GET /v4_29/apartments/{id}/
 */
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
        public ?string $houseType,
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

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): static
    {
        $id = self::extractId($data);

        $price = Price::fromArray($data) 
            ?? throw new \InvalidArgumentException('Price is required for house');

        $area = Area::fromArray($data) 
            ?? throw new \InvalidArgumentException('Area is required for house');

        $rooms = (int) ($data['rooms'] ?? $data['room'] ?? 0);

        // Определить тип дома по количеству комнат
        $houseType = match($rooms) {
            30 => 'cottage',
            40 => 'townhouse',
            default => $data['house_type'] ?? null,
        };

        return new self(
            id: $id,
            number: $data['number'] ?? null,
            rooms: $rooms,
            area: $area,
            kitchenArea: Area::fromArray($data, 'kitchen_area'),
            livingArea: Area::fromArray($data, 'living_area'),
            
            floor: (int) ($data['floor'] ?? 0),
            floorsTotal: isset($data['floors_total']) ? (int) $data['floors_total'] : null,
            section: $data['section'] ?? null,
            
            price: $price,
            pricePerMeter: Price::fromArray($data, 'price_per_meter'),
            
            blockId: $data['block_id'] ?? null,
            blockName: $data['block_name'] ?? null,
            buildingId: $data['building_id'] ?? null,
            
            layoutId: $data['layout_id'] ?? null,
            layoutType: $data['layout_type'] ?? null,
            
            finishing: $data['finishing'] ?? null,
            
            status: $data['status'] ?? null,
            deadline: self::parseDate($data['deadline'] ?? null),
            
            images: $data['images'] ?? [],
            floorPlans: $data['floor_plans'] ?? [],
            
            houseType: $houseType,
            plotArea: Area::fromArray($data, 'plot_area'),
            floorsInHouse: isset($data['floors_in_house']) ? (int) $data['floors_in_house'] : null,
            
            createdAt: self::parseDate($data['created_at'] ?? null),
            updatedAt: self::parseDate($data['updated_at'] ?? null),
            rawData: $data
        );
    }

    /**
     * Проверить, коттедж ли это
     */
    public function isCottage(): bool
    {
        return $this->houseType === 'cottage' || $this->rooms === 30;
    }

    /**
     * Проверить, таунхаус ли это
     */
    public function isTownhouse(): bool
    {
        return $this->houseType === 'townhouse' || $this->rooms === 40;
    }

    /**
     * Получить название типа дома
     */
    public function getHouseTypeLabel(): string
    {
        if ($this->isCottage()) {
            return 'Коттедж';
        }

        if ($this->isTownhouse()) {
            return 'Таунхаус';
        }

        return 'Дом';
    }
}
