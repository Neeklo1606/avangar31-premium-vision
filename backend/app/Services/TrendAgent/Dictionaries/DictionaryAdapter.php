<?php

namespace App\Services\TrendAgent\Dictionaries;

/**
 * Адаптер для нормализации форматов справочников
 * 
 * Ответственность:
 * - Нормализация 4 форматов справочников в единый
 * - Маппинг разных naming conventions
 * 
 * Форматы:
 * 1. 'directories' (apartment-api): { data: { metro: [...], districts: [...] } }
 * 2. 'enums' (parkings-api): { data: [...] }
 * 3. 'filters' (commerce-api): { name: '...', options: [...] }
 * 4. 'filter' (house-api): { filters: { section: { values: [...] } } }
 */
class DictionaryAdapter
{
    /**
     * Нормализовать справочник по формату
     * 
     * Результат:
     * [
     *   'key' => 'dictionary_name',
     *   'items' => [
     *     ['id' => '...', 'name' => '...', ...],
     *     ...
     *   ]
     * ]
     */
    public function normalize(array $rawData, string $format, ?string $dictionaryName = null): array
    {
        return match($format) {
            'directories' => $this->normalizeDirectories($rawData),
            'enums' => $this->normalizeEnums($rawData, $dictionaryName),
            'filters' => $this->normalizeFilters($rawData),
            'filter' => $this->normalizeFilter($rawData, $dictionaryName),
            default => throw new \InvalidArgumentException("Unknown dictionary format: {$format}"),
        };
    }

    /**
     * Формат 'directories' (apartment-api)
     * 
     * { data: { metro: [...], districts: [...] } }
     */
    private function normalizeDirectories(array $rawData): array
    {
        $data = $rawData['data'] ?? [];
        $result = [];

        foreach ($data as $key => $items) {
            $result[$key] = [
                'key' => $key,
                'items' => $this->normalizeItems($items),
            ];
        }

        return $result;
    }

    /**
     * Формат 'enums' (parkings-api)
     * 
     * { data: [...] }
     */
    private function normalizeEnums(array $rawData, ?string $key = null): array
    {
        $items = $rawData['data'] ?? $rawData;

        return [
            $key ?? 'items' => [
                'key' => $key ?? 'items',
                'items' => $this->normalizeItems($items),
            ],
        ];
    }

    /**
     * Формат 'filters' (commerce-api)
     * 
     * { name: '...', options: [...] }
     */
    private function normalizeFilters(array $rawData): array
    {
        $name = $rawData['name'] ?? 'filter';
        $items = $rawData['options'] ?? $rawData['values'] ?? [];

        return [
            $name => [
                'key' => $name,
                'items' => $this->normalizeItems($items),
            ],
        ];
    }

    /**
     * Формат 'filter' (house-api)
     * 
     * { filters: { section: { values: [...] } } }
     */
    private function normalizeFilter(array $rawData, ?string $filterName = null): array
    {
        $filters = $rawData['filters'] ?? $rawData;
        $result = [];

        if ($filterName !== null && isset($filters[$filterName])) {
            // Запрос конкретного фильтра
            $items = $filters[$filterName]['values'] ?? $filters[$filterName]['options'] ?? [];
            
            $result[$filterName] = [
                'key' => $filterName,
                'items' => $this->normalizeItems($items),
            ];
        } else {
            // Все фильтры
            foreach ($filters as $key => $filterData) {
                $items = $filterData['values'] ?? $filterData['options'] ?? [];
                
                $result[$key] = [
                    'key' => $key,
                    'items' => $this->normalizeItems($items),
                ];
            }
        }

        return $result;
    }

    /**
     * Нормализовать элементы справочника
     * 
     * Гарантирует наличие 'id' и 'name'
     */
    private function normalizeItems(array $items): array
    {
        return array_map(function ($item) {
            if (is_string($item)) {
                return [
                    'id' => $item,
                    'name' => $item,
                ];
            }

            return [
                'id' => $item['id'] ?? $item['_id'] ?? $item['value'] ?? null,
                'name' => $item['name'] ?? $item['label'] ?? $item['title'] ?? $item['id'] ?? null,
                'data' => $item,
            ];
        }, $items);
    }
}
