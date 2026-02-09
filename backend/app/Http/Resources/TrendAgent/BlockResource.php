<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use App\Services\TrendAgent\Entities\BlockEntity;

/**
 * API Resource для BlockEntity (ЖК)
 * 
 * Стабильный контракт для фронтенда
 */
class BlockResource extends BaseEntityResource
{
    /**
     * @var BlockEntity
     */
    public $resource;

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $block = $this->resource;

        return [
            // Базовые поля
            'id' => $block->id,
            'guid' => $block->guid,
            'name' => $block->name,
            'slug' => $block->slug,
            
            // Описание
            'description' => $block->description,
            'short_description' => $block->shortDescription,
            
            // Цены
            'price' => [
                'from' => $this->serializePrice($block->priceFrom),
                'to' => $this->serializePrice($block->priceTo),
                'has_range' => $block->hasPriceRange(),
            ],
            
            // Площади
            'area' => [
                'from' => $this->serializeArea($block->areaFrom),
                'to' => $this->serializeArea($block->areaTo),
                'has_range' => $block->hasAreaRange(),
            ],
            
            // Местоположение
            'location' => $this->serializeLocation($block->location),
            
            // Застройщик
            'developer' => $block->developer ? [
                'id' => $block->developer['id'] ?? null,
                'name' => $block->developer['name'] ?? null,
                'logo' => $block->developer['logo'] ?? null,
            ] : null,
            
            // Класс и тип
            'class' => $block->class,
            'type' => $block->type,
            
            // Статистика
            'stats' => $block->getStats(),
            
            // Статусы
            'status' => $block->status,
            'deadline' => $block->deadline?->toIso8601String(),
            
            // Контакты
            'contact' => $this->serializeContact($block->contact),
            
            // Особенности
            'features' => $block->features,
            'advantages' => $block->advantages,
            
            // Медиа
            'images' => [
                'main' => $block->mainImage,
                'gallery' => $block->images,
            ],
            
            // Временные метки
            'created_at' => $block->createdAt?->toIso8601String(),
            'updated_at' => $block->updatedAt?->toIso8601String(),
        ];
    }
}
