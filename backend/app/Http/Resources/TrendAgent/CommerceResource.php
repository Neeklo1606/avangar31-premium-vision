<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use App\Services\TrendAgent\Entities\CommerceEntity;

/**
 * API Resource для CommerceEntity (Коммерческая недвижимость)
 * 
 * Стабильный контракт для фронтенда
 */
class CommerceResource extends BaseEntityResource
{
    /**
     * @var CommerceEntity
     */
    public $resource;

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $commerce = $this->resource;

        return [
            // Базовые поля
            'id' => $commerce->id,
            'guid' => $commerce->guid,
            'number' => $commerce->number,
            
            // Цена
            'price' => $this->serializePrice($commerce->price),
            
            // Площадь
            'area' => $this->serializeArea($commerce->area),
            
            // Тип
            'type' => $commerce->type,
            'purpose' => $commerce->purpose,
            
            // Этаж и здание
            'floor' => $commerce->floor,
            'floors_total' => $commerce->floorsTotal,
            'section' => $commerce->section,
            
            // Блок (ЖК)
            'block' => $commerce->blockId ? [
                'id' => $commerce->blockId,
                'name' => $commerce->blockName,
            ] : null,
            
            // Местоположение
            'location' => $this->serializeLocation($commerce->location),
            
            // Характеристики
            'ceiling_height' => $commerce->ceilingHeight,
            'entrance' => $commerce->entrance,
            
            // Особенности
            'features' => $commerce->features,
            
            // Статус
            'status' => $commerce->status,
            'is_available' => $commerce->isAvailable,
            
            // Медиа
            'images' => [
                'plan' => $commerce->planImage,
                'gallery' => $commerce->images,
            ],
            
            // Временные метки
            'created_at' => $commerce->createdAt?->toIso8601String(),
            'updated_at' => $commerce->updatedAt?->toIso8601String(),
        ];
    }
}
