<?php

namespace App\Services\TrendAgent\Entities\ValueObjects;

/**
 * Value Object: Контактная информация
 * 
 * Неизменяемый объект для представления контактных данных
 */
readonly class Contact
{
    public function __construct(
        public ?string $phone,
        public ?string $email,
        public ?string $website
    ) {}

    /**
     * Создать из массива данных API
     */
    public static function fromArray(array $data): self
    {
        $phone = $data['phone'] ?? $data['phone_number'] ?? $data['contact_phone'] ?? null;
        $email = $data['email'] ?? $data['contact_email'] ?? null;
        $website = $data['website'] ?? $data['site'] ?? $data['url'] ?? null;

        return new self($phone, $email, $website);
    }

    /**
     * Проверить, есть ли хотя бы один контакт
     */
    public function hasAnyContact(): bool
    {
        return $this->phone !== null || $this->email !== null || $this->website !== null;
    }

    /**
     * Преобразовать в массив
     */
    public function toArray(): array
    {
        return [
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'hasAnyContact' => $this->hasAnyContact(),
        ];
    }
}
