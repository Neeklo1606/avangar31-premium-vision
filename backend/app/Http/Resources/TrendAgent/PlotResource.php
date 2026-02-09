<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use App\Services\TrendAgent\Entities\PlotEntity;

/**
 * API Resource для PlotEntity (Участки)
 * 
 * Стабильный контракт для фронтенда
 */
class PlotResource extends BaseEntityResource
{
    /**
     * @var PlotEntity
     */
    public $resource;

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $plot = $this->resource;

        return [
            // Базовые поля
            'id' => $plot->id,
            'guid' => $plot->guid,
            'number' => $plot->number,
            
            // Цена
            'price' => $this->serializePrice($plot->price),
            
            // Площадь
            'area' => $this->serializeArea($plot->area),
            
            // Местоположение
            'location' => $this->serializeLocation($plot->location),
            
            // Поселок
            'village' => $plot->villageId ? [
                'id' => $plot->villageId,
                'name' => $plot->villageName,
            ] : null,
            
            // Категория и назначение
            'category' => $plot->category,
            'purpose' => $plot->purpose,
            
            // Коммуникации
            'utilities' => $plot->utilities,
            
            // Особенности
            'features' => $plot->features,
            
            // Статус
            'status' => $plot->status,
            'is_available' => $plot->isAvailable,
            
            // Медиа
            'images' => $plot->images,
            
            // Временные метки
            'created_at' => $plot->createdAt?->toIso8601String(),
            'updated_at' => $plot->updatedAt?->toIso8601String(),
        ];
    }
}
