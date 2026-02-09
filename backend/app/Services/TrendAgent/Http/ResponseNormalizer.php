<?php

namespace App\Services\TrendAgent\Http;

use Illuminate\Http\Client\Response;

/**
 * Нормализатор ответов API
 * 
 * Ответственность:
 * - Нормализация разных форматов ответов в единый
 * - Маппинг полей по схеме
 * - Обработка разных naming conventions
 * 
 * ГРАНИЦА:
 * Raw API response → Normalized array
 * (Дальнейшая типизация в Entity происходит выше)
 */
class ResponseNormalizer
{
    /**
     * Нормализовать ответ по схеме
     * 
     * @param Response $response Сырой ответ API
     * @param array|null $schema Схема маппинга (опционально)
     * @return array Нормализованные данные
     */
    public function normalize(Response $response, ?array $schema = null): array
    {
        $data = $response->json();

        if ($schema === null) {
            return $data;
        }

        return $this->mapFields($data, $schema);
    }

    /**
     * Маппинг полей по схеме
     * 
     * Схема:
     * [
     *   'target_field' => 'source_field',
     *   'nested.field' => 'source.nested.field',
     * ]
     */
    public function mapFields(array $data, array $mapping): array
    {
        $result = [];

        foreach ($mapping as $targetField => $sourcePath) {
            $value = $this->getNestedValue($data, $sourcePath);
            $this->setNestedValue($result, $targetField, $value);
        }

        return $result;
    }

    /**
     * Нормализовать каталожный ответ
     * 
     * Обрабатывает разные форматы:
     * - { data: [...], total: N }
     * - { items: [...], count: N }
     * - [...] (массив без обёртки)
     */
    public function normalizeCatalogResponse(Response $response): array
    {
        if (!$response->successful()) {
            return ['items' => [], 'total' => 0];
        }

        $data = $response->json();
        if (!is_array($data)) {
            return ['items' => [], 'total' => 0];
        }

        // Если это массив — вернуть как есть
        if (isset($data[0])) {
            return [
                'items' => $data,
                'total' => count($data),
            ];
        }

        // Если есть data/items и total/count
        $items = $data['data'] ?? $data['items'] ?? $data['results'] ?? [];
        $total = $data['total'] ?? $data['count'] ?? $data['totalCount'] ?? count($items);

        return [
            'items' => $items,
            'total' => $total,
        ];
    }

    /**
     * Получить вложенное значение по пути (dot notation)
     * 
     * Пример: 'user.profile.name'
     */
    private function getNestedValue(array $data, string $path): mixed
    {
        $keys = explode('.', $path);
        $value = $data;

        foreach ($keys as $key) {
            if (!isset($value[$key])) {
                return null;
            }
            $value = $value[$key];
        }

        return $value;
    }

    /**
     * Установить вложенное значение по пути (dot notation)
     */
    private function setNestedValue(array &$data, string $path, mixed $value): void
    {
        $keys = explode('.', $path);
        $current = &$data;

        foreach ($keys as $i => $key) {
            if ($i === count($keys) - 1) {
                $current[$key] = $value;
            } else {
                if (!isset($current[$key]) || !is_array($current[$key])) {
                    $current[$key] = [];
                }
                $current = &$current[$key];
            }
        }
    }
}
