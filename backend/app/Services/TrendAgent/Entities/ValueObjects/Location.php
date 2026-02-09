<?php

namespace App\Services\TrendAgent\Entities\ValueObjects;

/**
 * Value Object: Локация
 * 
 * Неизменяемый объект для представления географического местоположения
 */
readonly class Location
{
    public function __construct(
        public ?float $latitude,
        public ?float $longitude,
        public ?string $address,
        public ?string $district,
        public ?array $metro
    ) {}

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): self
    {
        $coordinates = $data['coordinates'] ?? $data['geo'] ?? $data['location'] ?? [];
        
        $latitude = $coordinates['lat'] ?? $coordinates['latitude'] ?? $data['lat'] ?? null;
        $longitude = $coordinates['lon'] ?? $coordinates['lng'] ?? $coordinates['longitude'] ?? $data['lon'] ?? $data['lng'] ?? null;

        $address = $data['address'] ?? $data['full_address'] ?? null;
        $district = $data['district'] ?? $data['district_name'] ?? null;
        
        $metro = $data['metro'] ?? $data['metro_stations'] ?? $data['nearest_metro'] ?? null;
        if (is_array($metro) && !empty($metro)) {
            // Нормализовать массив метро
            $metro = array_map(function($station) {
                if (is_string($station)) {
                    return ['name' => $station];
                }
                return $station;
            }, $metro);
        }

        return new self(
            $latitude ? (float) $latitude : null,
            $longitude ? (float) $longitude : null,
            $address,
            $district,
            $metro
        );
    }

    /**
     * Проверить, есть ли координаты
     */
    public function hasCoordinates(): bool
    {
        return $this->latitude !== null && $this->longitude !== null;
    }

    /**
     * Получить координаты как массив
     */
    public function getCoordinates(): ?array
    {
        if (!$this->hasCoordinates()) {
            return null;
        }

        return [
            'lat' => $this->latitude,
            'lng' => $this->longitude,
        ];
    }

    /**
     * Преобразовать в массив
     */
    public function toArray(): array
    {
        return [
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'coordinates' => $this->getCoordinates(),
            'address' => $this->address,
            'district' => $this->district,
            'metro' => $this->metro,
            'hasCoordinates' => $this->hasCoordinates(),
        ];
    }
}
