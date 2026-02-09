<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use App\Services\TrendAgent\Entities\ParkingEntity;

/**
 * API Resource для ParkingEntity (Паркинг)
 * 
 * Стабильный контракт для фронтенда
 */
class ParkingResource extends BaseEntityResource
{
    /**
     * @var ParkingEntity
     */
    public $resource;

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $parking = $this->resource;

        return [
            // Базовые поля
            'id' => $parking->id,
            'guid' => $parking->guid,
            'number' => $parking->number,
            
            // Цена
            'price' => $this->serializePrice($parking->price),
            
            // Площадь
            'area' => $this->serializeArea($parking->area),
            
            // Тип и характеристики
            'type' => $parking->type,
            'level' => $parking->level,
            'section' => $parking->section,
            
            // Блок (ЖК)
            'block' => $parking->blockId ? [
                'id' => $parking->blockId,
                'name' => $parking->blockName,
            ] : null,
            
            // Особенности
            'features' => $parking->features,
            
            // Статус
            'status' => $parking->status,
            'is_available' => $parking->isAvailable,
            
            // Медиа
            'images' => $parking->images,
            
            // Временные метки
            'created_at' => $parking->createdAt?->toIso8601String(),
            'updated_at' => $parking->updatedAt?->toIso8601String(),
        ];
    }
}
