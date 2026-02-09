<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use App\Services\TrendAgent\Entities\HouseEntity;

/**
 * API Resource для HouseEntity (Дома)
 * 
 * Стабильный контракт для фронтенда
 * Расширяет ApartmentResource дополнительными полями для домов
 */
class HouseResource extends BaseEntityResource
{
    /**
     * @var HouseEntity
     */
    public $resource;

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $house = $this->resource;

        return [
            // Базовые поля
            'id' => $house->id,
            'guid' => $house->guid,
            'number' => $house->number,
            
            // Цена
            'price' => $this->serializePrice($house->price),
            
            // Площадь
            'area' => [
                'total' => $this->serializeArea($house->area),
                'living' => $this->serializeArea($house->livingArea),
                'kitchen' => $this->serializeArea($house->kitchenArea),
                'land' => $this->serializeArea($house->landArea),
            ],
            
            // Комнаты
            'rooms' => [
                'count' => $house->rooms,
                'is_studio' => $house->isStudio(),
                'label' => $house->getRoomsLabel(),
            ],
            
            // Этажность
            'floors_total' => $house->floorsTotal,
            
            // Местоположение
            'location' => $this->serializeLocation($house->location),
            
            // Блок (Поселок/ЖК)
            'block' => $house->blockId ? [
                'id' => $house->blockId,
                'name' => $house->blockName,
            ] : null,
            
            // Коммуникации
            'utilities' => $house->utilities,
            
            // Отделка и особенности
            'decoration' => $house->decoration,
            'features' => $house->features,
            
            // Статус
            'status' => $house->status,
            'is_available' => $house->isAvailable,
            
            // Медиа
            'images' => [
                'plan' => $house->planImage,
                'gallery' => $house->images,
            ],
            
            // Временные метки
            'created_at' => $house->createdAt?->toIso8601String(),
            'updated_at' => $house->updatedAt?->toIso8601String(),
        ];
    }
}
