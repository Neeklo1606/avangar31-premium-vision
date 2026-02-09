<?php

namespace App\Services\TrendAgent\Filters;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Contracts\FilterSet;
use App\Services\TrendAgent\Core\Errors\InvalidFilterError;

/**
 * Унифицированный построитель фильтров
 * 
 * Ответственность:
 * - Создание FilterSet для типа объекта
 * - Валидация фильтров
 * - Применение фильтров
 * 
 * ЕДИНЫЙ ПОСТРОИТЕЛЬ ДЛЯ ВСЕХ ТИПОВ ОБЪЕКТОВ
 * (НЕ дублируется для каждого типа)
 */
class FilterBuilder
{
    public function __construct(
        private readonly FilterRegistry $registry
    ) {}

    /**
     * Создать пустой набор фильтров
     */
    public function create(ObjectType $objectType): FilterSet
    {
        return new FilterSet($objectType);
    }

    /**
     * Создать набор фильтров из массива
     * 
     * @throws InvalidFilterError если фильтр невалиден
     */
    public function createFromArray(ObjectType $objectType, array $filters): FilterSet
    {
        $filterSet = $this->create($objectType);

        foreach ($filters as $key => $value) {
            $this->addFilter($filterSet, $key, $value);
        }

        return $filterSet;
    }

    /**
     * Добавить фильтр
     * 
     * @throws InvalidFilterError если фильтр невалиден
     */
    public function addFilter(FilterSet $filterSet, string $key, mixed $value): FilterSet
    {
        // Получить определение фильтра
        $definition = $this->registry->get($key);

        if ($definition === null) {
            throw new InvalidFilterError(
                "Unknown filter: {$key}",
                context: ['filter' => $key, 'objectType' => $filterSet->objectType->value]
            );
        }

        // Проверить применимость к типу объекта
        if (!$definition->isApplicableTo($filterSet->objectType->value)) {
            throw new InvalidFilterError(
                "Filter '{$key}' is not applicable to object type '{$filterSet->objectType->value}'",
                context: ['filter' => $key, 'objectType' => $filterSet->objectType->value]
            );
        }

        // Валидировать значение
        if (!$definition->validate($value)) {
            throw new InvalidFilterError(
                "Invalid value for filter '{$key}'",
                context: ['filter' => $key, 'value' => $value, 'type' => $definition->type]
            );
        }

        // Добавить фильтр
        $filterSet->add($key, $value);

        return $filterSet;
    }

    /**
     * Удалить фильтр
     */
    public function removeFilter(FilterSet $filterSet, string $key): FilterSet
    {
        $filterSet->remove($key);
        return $filterSet;
    }

    /**
     * Получить все доступные фильтры для типа объекта
     * 
     * @return array<string, FilterDefinition>
     */
    public function getAvailableFilters(ObjectType $objectType): array
    {
        return $this->registry->getForObjectType($objectType);
    }

    /**
     * Валидировать набор фильтров
     * 
     * @throws InvalidFilterError если хотя бы один фильтр невалиден
     */
    public function validate(FilterSet $filterSet): bool
    {
        foreach ($filterSet->all() as $key => $value) {
            $definition = $this->registry->get($key);

            if ($definition === null) {
                throw new InvalidFilterError(
                    "Unknown filter: {$key}",
                    context: ['filter' => $key]
                );
            }

            if (!$definition->validate($value)) {
                throw new InvalidFilterError(
                    "Invalid value for filter '{$key}'",
                    context: ['filter' => $key, 'value' => $value]
                );
            }
        }

        return true;
    }

    /**
     * Преобразовать FilterSet в query параметры для API
     */
    public function toQueryParams(FilterSet $filterSet): array
    {
        $params = [];

        foreach ($filterSet->all() as $key => $value) {
            $definition = $this->registry->get($key);

            if ($definition === null) {
                continue;
            }

            // Преобразовать значение в формат API
            $apiValue = $this->transformValueForApi($value, $definition->type);

            if (is_array($apiValue) && isset($apiValue[0])) {
                // Множественные значения (room=30&room=40)
                $params[$key] = $apiValue;
            } else {
                $params[$key] = $apiValue;
            }
        }

        return $params;
    }

    /**
     * Преобразовать значение фильтра в формат API
     */
    private function transformValueForApi(mixed $value, string $type): mixed
    {
        return match($type) {
            'range' => $this->transformRange($value),
            'multiselect' => $this->transformMultiselect($value),
            'boolean' => $this->transformBoolean($value),
            default => $value,
        };
    }

    /**
     * Преобразовать range в формат API
     * 
     * ['from' => 1000000, 'to' => 5000000] → ['price_from' => 1000000, 'price_to' => 5000000]
     */
    private function transformRange(array $value): array
    {
        $result = [];

        if (isset($value['from'])) {
            $result['from'] = $value['from'];
        }

        if (isset($value['to'])) {
            $result['to'] = $value['to'];
        }

        return $result;
    }

    /**
     * Преобразовать multiselect в массив
     */
    private function transformMultiselect(mixed $value): array
    {
        if (!is_array($value)) {
            return [$value];
        }

        return $value;
    }

    /**
     * Преобразовать boolean в string для API
     */
    private function transformBoolean(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        return (string) $value;
    }
}
