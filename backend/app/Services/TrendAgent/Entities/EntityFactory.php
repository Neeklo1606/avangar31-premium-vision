<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\Mappers\EntityMapper;

/**
 * Фабрика для создания Entity
 * 
 * Использует зарегистрированные Mapper'ы для преобразования данных
 */
class EntityFactory
{
    /** @var array<string, EntityMapper> */
    private array $mappers = [];

    /**
     * Зарегистрировать Mapper
     */
    public function registerMapper(EntityMapper $mapper): void
    {
        $this->mappers[$mapper->getObjectType()->value] = $mapper;
    }

    /**
     * Зарегистрировать несколько Mapper'ов
     * 
     * @param EntityMapper[] $mappers
     */
    public function registerMappers(array $mappers): void
    {
        foreach ($mappers as $mapper) {
            $this->registerMapper($mapper);
        }
    }

    /**
     * Создать Entity из данных
     * 
     * @throws \InvalidArgumentException если Mapper не найден
     */
    public function create(ObjectType $objectType, array $data): AbstractEntity
    {
        $mapper = $this->getMapper($objectType);

        if ($mapper === null) {
            throw new \InvalidArgumentException(
                "No mapper registered for object type: {$objectType->value}"
            );
        }

        return $mapper->map($data);
    }

    /**
     * Создать массив Entity из массива данных
     * 
     * @return AbstractEntity[]
     */
    public function createMany(ObjectType $objectType, array $items): array
    {
        return array_map(
            fn($item) => $this->create($objectType, $item),
            $items
        );
    }

    /**
     * Получить Mapper для типа объекта
     */
    public function getMapper(ObjectType $objectType): ?EntityMapper
    {
        return $this->mappers[$objectType->value] ?? null;
    }

    /**
     * Проверить, зарегистрирован ли Mapper
     */
    public function hasMapper(ObjectType $objectType): bool
    {
        return isset($this->mappers[$objectType->value]);
    }

    /**
     * Получить все зарегистрированные Mapper'ы
     * 
     * @return EntityMapper[]
     */
    public function getMappers(): array
    {
        return array_values($this->mappers);
    }
}
