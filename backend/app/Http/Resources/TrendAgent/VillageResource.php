<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use App\Services\TrendAgent\Entities\VillageEntity;

/**
 * API Resource для VillageEntity (Поселки)
 * 
 * Стабильный контракт для фронтенда
 */
class VillageResource extends BaseEntityResource
{
    /**
     * @var VillageEntity
     */
    public $resource;

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $village = $this->resource;

        return [
            // Базовые поля
            'id' => $village->id,
            'guid' => $village->guid,
            'name' => $village->name,
            'slug' => $village->slug,
            
            // Описание
            'description' => $village->description,
            'short_description' => $village->shortDescription,
            
            // Цены участков
            'price' => [
                'from' => $this->serializePrice($village->priceFrom),
                'to' => $this->serializePrice($village->priceTo),
            ],
            
            // Площади участков
            'area' => [
                'from' => $this->serializeArea($village->areaFrom),
                'to' => $this->serializeArea($village->areaTo),
            ],
            
            // Местоположение
            'location' => $this->serializeLocation($village->location),
            
            // Класс и статус
            'class' => $village->class,
            'status' => $village->status,
            
            // Статистика
            'stats' => [
                'total_plots' => $village->totalPlots,
                'available_plots' => $village->availablePlots,
            ],
            
            // Застройщик
            'developer' => $village->developer ? [
                'id' => $village->developer['id'] ?? null,
                'name' => $village->developer['name'] ?? null,
                'logo' => $village->developer['logo'] ?? null,
            ] : null,
            
            // Инфраструктура
            'infrastructure' => $village->infrastructure,
            'utilities' => $village->utilities,
            
            // Особенности
            'features' => $village->features,
            'advantages' => $village->advantages,
            
            // Медиа
            'images' => [
                'main' => $village->mainImage,
                'gallery' => $village->images,
            ],
            
            // Временные метки
            'created_at' => $village->createdAt?->toIso8601String(),
            'updated_at' => $village->updatedAt?->toIso8601String(),
        ];
    }
}
