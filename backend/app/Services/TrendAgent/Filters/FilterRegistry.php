<?php

namespace App\Services\TrendAgent\Filters;

use App\Services\TrendAgent\Core\ObjectType;

/**
 * Реестр всех доступных фильтров
 * 
 * Ответственность:
 * - Хранение определений фильтров
 * - Получение фильтров по типу объекта
 * - Валидация существования фильтра
 * 
 * ЦЕНТРАЛЬНАЯ ТОЧКА КОНФИГУРАЦИИ ФИЛЬТРОВ:
 * Все фильтры регистрируются здесь
 */
class FilterRegistry
{
    /** @var array<string, FilterDefinition> */
    private array $filters = [];

    public function __construct()
    {
        $this->registerFilters();
    }

    /**
     * Получить определение фильтра
     */
    public function get(string $key): ?FilterDefinition
    {
        return $this->filters[$key] ?? null;
    }

    /**
     * Получить все фильтры для типа объекта
     * 
     * @return array<string, FilterDefinition>
     */
    public function getForObjectType(ObjectType $objectType): array
    {
        $applicable = [];

        foreach ($this->filters as $key => $filter) {
            if ($filter->isApplicableTo($objectType->value)) {
                $applicable[$key] = $filter;
            }
        }

        return $applicable;
    }

    /**
     * Проверить, существует ли фильтр
     */
    public function has(string $key): bool
    {
        return isset($this->filters[$key]);
    }

    /**
     * Проверить, применим ли фильтр к типу объекта
     */
    public function isApplicable(string $key, ObjectType $objectType): bool
    {
        $filter = $this->get($key);

        if ($filter === null) {
            return false;
        }

        return $filter->isApplicableTo($objectType->value);
    }

    /**
     * Зарегистрировать фильтр
     */
    public function register(FilterDefinition $filter): void
    {
        $this->filters[$filter->key] = $filter;
    }

    /**
     * Регистрация всех фильтров
     * 
     * ЗДЕСЬ ХРАНЯТСЯ ВСЕ ОПРЕДЕЛЕНИЯ ФИЛЬТРОВ
     */
    private function registerFilters(): void
    {
        // УНИВЕРСАЛЬНЫЕ ФИЛЬТРЫ (применимы ко всем типам)
        
        $this->register(new FilterDefinition(
            key: 'price',
            type: 'range',
            label: 'Цена',
            config: ['unit' => '₽']
        ));

        $this->register(new FilterDefinition(
            key: 'area',
            type: 'range',
            label: 'Площадь',
            config: ['unit' => 'м²']
        ));

        // ФИЛЬТРЫ ДЛЯ КВАРТИР И ДОМОВ

        $this->register(new FilterDefinition(
            key: 'room',
            type: 'multiselect',
            label: 'Количество комнат',
            objectTypes: ['apartments', 'houses']
        ));

        $this->register(new FilterDefinition(
            key: 'floor',
            type: 'range',
            label: 'Этаж',
            objectTypes: ['apartments']
        ));

        $this->register(new FilterDefinition(
            key: 'finishing',
            type: 'select',
            label: 'Отделка',
            objectTypes: ['apartments', 'houses', 'blocks']
        ));

        $this->register(new FilterDefinition(
            key: 'block_id',
            type: 'select',
            label: 'ЖК',
            objectTypes: ['apartments']
        ));

        // ФИЛЬТРЫ ДЛЯ ПАРКИНГОВ

        $this->register(new FilterDefinition(
            key: 'parking_type',
            type: 'select',
            label: 'Тип паркинга',
            objectTypes: ['parking']
        ));

        $this->register(new FilterDefinition(
            key: 'number',
            type: 'select',
            label: 'Номер',
            objectTypes: ['parking', 'commerce']
        ));

        // ФИЛЬТРЫ ДЛЯ УЧАСТКОВ

        $this->register(new FilterDefinition(
            key: 'plot_area',
            type: 'range',
            label: 'Площадь участка',
            config: ['unit' => 'соток'],
            objectTypes: ['plots']
        ));

        $this->register(new FilterDefinition(
            key: 'communications',
            type: 'multiselect',
            label: 'Коммуникации',
            objectTypes: ['plots']
        ));

        // ФИЛЬТРЫ ДЛЯ КОММЕРЦИИ

        $this->register(new FilterDefinition(
            key: 'commerce_type',
            type: 'select',
            label: 'Тип помещения',
            objectTypes: ['commerce']
        ));

        // ФИЛЬТРЫ ДЛЯ ПРОЕКТОВ ДОМОВ

        $this->register(new FilterDefinition(
            key: 'floors_count',
            type: 'range',
            label: 'Этажность',
            objectTypes: ['house_projects']
        ));

        $this->register(new FilterDefinition(
            key: 'material',
            type: 'select',
            label: 'Материал',
            objectTypes: ['house_projects']
        ));

        // ФИЛЬТРЫ ДЛЯ БЛОКОВ (ЖК)

        $this->register(new FilterDefinition(
            key: 'deadline',
            type: 'select',
            label: 'Срок сдачи',
            objectTypes: ['blocks']
        ));

        $this->register(new FilterDefinition(
            key: 'class',
            type: 'select',
            label: 'Класс жилья',
            objectTypes: ['blocks']
        ));

        // ГЕОФИЛЬТРЫ (применимы к большинству типов)

        $this->register(new FilterDefinition(
            key: 'district',
            type: 'multiselect',
            label: 'Район',
            objectTypes: ['blocks', 'apartments', 'parking', 'commerce']
        ));

        $this->register(new FilterDefinition(
            key: 'metro',
            type: 'multiselect',
            label: 'Метро',
            objectTypes: ['blocks', 'apartments', 'parking', 'commerce']
        ));

        // СОРТИРОВКА (технически не фильтр, но используется FilterBuilder)

        $this->register(new FilterDefinition(
            key: 'sort',
            type: 'select',
            label: 'Сортировка'
        ));

        $this->register(new FilterDefinition(
            key: 'sort_order',
            type: 'select',
            label: 'Порядок сортировки'
        ));
    }
}
