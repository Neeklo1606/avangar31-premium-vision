<?php

namespace App\Services\TrendAgent\Entities\ValueObjects;

/**
 * Value Object: Площадь
 * 
 * Неизменяемый объект для представления площади
 */
readonly class Area
{
    public function __construct(
        public float $value,
        public string $unit = 'm²'
    ) {
        if ($value < 0) {
            throw new \InvalidArgumentException('Area cannot be negative');
        }
    }

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data, string $key = 'area'): ?self
    {
        $value = $data[$key] ?? null;
        
        if ($value === null) {
            return null;
        }

        $unit = $data[$key . '_unit'] ?? 'm²';

        return new self((float) $value, $unit);
    }

    /**
     * Форматированная строка
     */
    public function format(): string
    {
        return number_format($this->value, 2, '.', ' ') . ' ' . $this->unit;
    }

    /**
     * Преобразовать в массив
     */
    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'unit' => $this->unit,
            'formatted' => $this->format(),
        ];
    }
}
