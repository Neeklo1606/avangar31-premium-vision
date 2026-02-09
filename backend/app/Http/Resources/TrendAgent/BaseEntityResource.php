<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\TrendAgent\Entities\AbstractEntity;

/**
 * Базовый Resource для TrendAgent Entity
 * 
 * Преобразует Domain Entity в стабильный API-контракт для фронтенда
 * 
 * ВАЖНО:
 * - НЕ использует toArray() у Entity
 * - НЕ смешивает Domain и Presentation слой
 * - Стабильный контракт независимый от backend изменений
 */
abstract class BaseEntityResource extends JsonResource
{
    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    abstract public function toArray(Request $request): array;

    /**
     * Получить базовые поля для всех Entity
     */
    protected function getBaseFields(AbstractEntity $entity): array
    {
        return [
            'id' => $entity->id,
            'created_at' => $entity->createdAt?->toIso8601String(),
            'updated_at' => $entity->updatedAt?->toIso8601String(),
        ];
    }

    /**
     * Сериализация Price Value Object
     */
    protected function serializePrice(?\App\Services\TrendAgent\Entities\ValueObjects\Price $price): ?array
    {
        if (!$price) {
            return null;
        }

        return [
            'value' => $price->value,
            'currency' => $price->currency,
            'formatted' => $price->format(),
        ];
    }

    /**
     * Сериализация Area Value Object
     */
    protected function serializeArea(?\App\Services\TrendAgent\Entities\ValueObjects\Area $area): ?array
    {
        if (!$area) {
            return null;
        }

        return [
            'value' => $area->value,
            'unit' => $area->unit,
            'formatted' => $area->format(),
        ];
    }

    /**
     * Сериализация Location Value Object
     */
    protected function serializeLocation(?\App\Services\TrendAgent\Entities\ValueObjects\Location $location): ?array
    {
        if (!$location) {
            return null;
        }

        return [
            'coordinates' => $location->hasCoordinates() ? [
                'lat' => $location->latitude,
                'lng' => $location->longitude,
            ] : null,
            'address' => $location->address,
            'district' => $location->district,
            'metro' => $location->metro,
        ];
    }

    /**
     * Сериализация Contact Value Object
     */
    protected function serializeContact(?\App\Services\TrendAgent\Entities\ValueObjects\Contact $contact): ?array
    {
        if (!$contact || !$contact->hasAnyContact()) {
            return null;
        }

        return [
            'phone' => $contact->phone,
            'email' => $contact->email,
            'website' => $contact->website,
        ];
    }
}
