<?php

namespace App\Services\TrendAgent\Entities\Mappers;

use App\Services\TrendAgent\Core\ObjectType;

/**
 * Абстрактный Mapper с общей логикой
 */
abstract class AbstractMapper implements EntityMapper
{
    public function __construct(
        protected readonly ObjectType $objectType
    ) {}

    /**
     * Проверить, поддерживает ли Mapper данный ObjectType
     */
    public function supports(ObjectType $objectType): bool
    {
        return $this->objectType === $objectType;
    }

    /**
     * Получить ObjectType, который поддерживает Mapper
     */
    public function getObjectType(): ObjectType
    {
        return $this->objectType;
    }

    /**
     * Валидировать данные перед маппингом
     * 
     * @throws \InvalidArgumentException
     */
    protected function validate(array $data): void
    {
        if (empty($data)) {
            throw new \InvalidArgumentException('Data cannot be empty');
        }

        if (!isset($data['_id']) && !isset($data['id'])) {
            throw new \InvalidArgumentException('ID is required');
        }
    }
}
