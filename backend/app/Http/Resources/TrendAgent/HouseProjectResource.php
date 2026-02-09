<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use App\Services\TrendAgent\Entities\HouseProjectEntity;

/**
 * API Resource для HouseProjectEntity (Проекты домов)
 * 
 * Стабильный контракт для фронтенда
 */
class HouseProjectResource extends BaseEntityResource
{
    /**
     * @var HouseProjectEntity
     */
    public $resource;

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $project = $this->resource;

        return [
            // Базовые поля
            'id' => $project->id,
            'guid' => $project->guid,
            'name' => $project->name,
            'slug' => $project->slug,
            
            // Описание
            'description' => $project->description,
            
            // Цена
            'price' => $this->serializePrice($project->price),
            
            // Площадь
            'area' => [
                'total' => $this->serializeArea($project->area),
                'living' => $this->serializeArea($project->livingArea),
            ],
            
            // Характеристики
            'rooms' => $project->rooms,
            'floors' => $project->floors,
            'bedrooms' => $project->bedrooms,
            'bathrooms' => $project->bathrooms,
            
            // Материалы и стиль
            'material' => $project->material,
            'style' => $project->style,
            'foundation' => $project->foundation,
            'roof' => $project->roof,
            
            // Подрядчик
            'contractor' => $project->contractorId ? [
                'id' => $project->contractorId,
                'name' => $project->contractorName,
            ] : null,
            
            // Особенности
            'features' => $project->features,
            
            // Медиа
            'images' => [
                'main' => $project->mainImage,
                'gallery' => $project->images,
                'plans' => $project->planImages,
            ],
            
            // Временные метки
            'created_at' => $project->createdAt?->toIso8601String(),
            'updated_at' => $project->updatedAt?->toIso8601String(),
        ];
    }
}
