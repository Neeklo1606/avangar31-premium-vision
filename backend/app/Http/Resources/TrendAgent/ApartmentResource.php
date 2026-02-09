<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use App\Services\TrendAgent\Entities\ApartmentEntity;

/**
 * API Resource для ApartmentEntity (Квартиры)
 * 
 * Стабильный контракт для фронтенда
 */
class ApartmentResource extends BaseEntityResource
{
    /**
     * @var ApartmentEntity
     */
    public $resource;

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $apartment = $this->resource;

        return [
            // Базовые поля
            'id' => $apartment->id,
            'guid' => $apartment->guid,
            'number' => $apartment->number,
            
            // Цена
            'price' => $this->serializePrice($apartment->price),
            
            // Площадь
            'area' => [
                'total' => $this->serializeArea($apartment->area),
                'living' => $this->serializeArea($apartment->livingArea),
                'kitchen' => $this->serializeArea($apartment->kitchenArea),
            ],
            
            // Комнаты
            'rooms' => [
                'count' => $apartment->rooms,
                'is_studio' => $apartment->isStudio(),
                'label' => $apartment->getRoomsLabel(),
            ],
            
            // Этаж и здание
            'floor' => $apartment->floor,
            'floors_total' => $apartment->floorsTotal,
            'section' => $apartment->section,
            'building' => $apartment->building,
            
            // Блок (ЖК)
            'block' => $apartment->blockId ? [
                'id' => $apartment->blockId,
                'name' => $apartment->blockName,
            ] : null,
            
            // Планировка
            'layout' => [
                'id' => $apartment->layoutId,
                'type' => $apartment->layoutType,
            ],
            
            // Отделка и особенности
            'decoration' => $apartment->decoration,
            'features' => $apartment->features,
            
            // Статус
            'status' => $apartment->status,
            'is_available' => $apartment->isAvailable,
            
            // Медиа
            'images' => [
                'plan' => $apartment->planImage,
                'gallery' => $apartment->images,
            ],
            
            // Временные метки
            'created_at' => $apartment->createdAt?->toIso8601String(),
            'updated_at' => $apartment->updatedAt?->toIso8601String(),
        ];
    }
}
