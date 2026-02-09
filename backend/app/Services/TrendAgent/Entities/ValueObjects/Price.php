<?php

namespace App\Services\TrendAgent\Entities\ValueObjects;

/**
 * Value Object: Цена
 * 
 * Неизменяемый объект для представления денежной суммы
 */
readonly class Price
{
    public function __construct(
        public float $value,
        public string $currency = 'RUB'
    ) {
        if ($value < 0) {
            throw new \InvalidArgumentException('Price cannot be negative');
        }
    }

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data, string $key = 'price'): ?self
    {
        $value = $data[$key] ?? null;
        
        if ($value === null) {
            return null;
        }

        $currency = $data[$key . '_currency'] ?? $data['currency'] ?? 'RUB';

        return new self((float) $value, $currency);
    }

    /**
     * Форматированная строка
     */
    public function format(): string
    {
        $formatted = number_format($this->value, 0, '.', ' ');
        
        return match($this->currency) {
            'RUB' => "{$formatted} ₽",
            'USD' => "\${$formatted}",
            'EUR' => "€{$formatted}",
            default => "{$formatted} {$this->currency}",
        };
    }

    /**
     * Преобразовать в массив
     */
    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'currency' => $this->currency,
            'formatted' => $this->format(),
        ];
    }
}
