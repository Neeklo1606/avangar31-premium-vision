<?php

namespace App\Services\TrendAgent\Entities\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\AbstractEntity;

/**
 * Интерфейс Mapper'а для Entity
 * 
 * Каждый Mapper отвечает за преобразование
 * raw API data → конкретную Entity
 */
interface EntityMapper
{
    /**
     * Проверить, поддерживает ли Mapper данный ObjectType
     */
    public function supports(ObjectType $objectType): bool;

    /**
     * Преобразовать данные в Entity
     * 
     * @throws \InvalidArgumentException если данные невалидны
     */
    public function map(array $data): AbstractEntity;

    /**
     * Получить ObjectType, который поддерживает Mapper
     */
    public function getObjectType(): ObjectType;
}
