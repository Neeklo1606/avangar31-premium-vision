<?php

namespace App\Services\TrendAgent\Entities;

use DateTimeImmutable;

/**
 * Базовая абстрактная Entity
 * 
 * Все Entity наследуются от этого класса
 * Гарантирует наличие общих полей и методов
 */
abstract readonly class AbstractEntity
{
    public function __construct(
        public string $id,
        public ?DateTimeImmutable $createdAt = null,
        public ?DateTimeImmutable $updatedAt = null,
        public array $rawData = []
    ) {}

    /**
     * Создать Entity из массива данных API
     * 
     * Должен быть реализован в каждой дочерней Entity
     */
    abstract public static function fromArray(array $data): static;

    /**
     * Преобразовать Entity в массив
     * 
     * Базовая реализация возвращает rawData
     * Может быть переопределена в дочерних классах
     */
    public function toArray(): array
    {
        return $this->rawData;
    }

    /**
     * Получить ID
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Получить дату создания
     */
    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    /**
     * Получить дату обновления
     */
    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    /**
     * Получить сырые данные API
     */
    public function getRawData(): array
    {
        return $this->rawData;
    }

    /**
     * Проверить равенство Entity
     */
    public function equals(?AbstractEntity $other): bool
    {
        if ($other === null) {
            return false;
        }

        return $this->id === $other->id 
            && get_class($this) === get_class($other);
    }

    /**
     * Хелпер: извлечь ID из данных API
     */
    protected static function extractId(array $data): string
    {
        return $data['_id'] ?? $data['id'] ?? throw new \InvalidArgumentException('ID is required');
    }

    /**
     * Хелпер: парсинг даты
     */
    protected static function parseDate(mixed $value): ?DateTimeImmutable
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof DateTimeImmutable) {
            return $value;
        }

        if (is_numeric($value)) {
            // Unix timestamp
            return (new DateTimeImmutable())->setTimestamp((int) $value);
        }

        try {
            return new DateTimeImmutable($value);
        } catch (\Exception $e) {
            return null;
        }
    }
}
