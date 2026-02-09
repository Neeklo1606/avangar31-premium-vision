<?php

namespace App\Services\TrendAgent\Detail;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Errors\PartialAggregationError;
use App\Services\TrendAgent\Detail\Strategies\DetailStrategy;
use App\Services\TrendAgent\Http\ParallelExecutor;
use App\Services\TrendAgent\Http\ResponseNormalizer;

/**
 * Оркестратор агрегации данных из множественных endpoint'ов
 * 
 * Ответственность:
 * - Параллельное выполнение запросов
 * - Обработка частичных ошибок
 * - Применение стратегий агрегации
 * 
 * Используется для:
 * - Детальных страниц с множественными источниками данных
 * - Блоки (ЖК): 22 endpoint'а
 * - Шахматка: несколько endpoint'ов
 */
class DetailAggregator
{
    private array $strategies = [];

    public function __construct(
        private readonly ParallelExecutor $parallelExecutor,
        private readonly ResponseNormalizer $normalizer
    ) {}

    /**
     * Зарегистрировать стратегию
     */
    public function registerStrategy(DetailStrategy $strategy): void
    {
        $this->strategies[$strategy->getObjectType()->value] = $strategy;
    }

    /**
     * Агрегировать данные
     * 
     * @param ObjectType $objectType Тип объекта
     * @param string $id ID объекта
     * @param string $city ID города
     * @return array Агрегированные данные
     * @throws PartialAggregationError если часть запросов неудачна
     */
    public function aggregate(ObjectType $objectType, string $id, string $city): array
    {
        // Получить стратегию
        $strategy = $this->getStrategy($objectType);

        if ($strategy === null) {
            throw new \InvalidArgumentException(
                "No aggregation strategy for object type: {$objectType->value}"
            );
        }

        // Получить список endpoint'ов
        $endpoints = $strategy->getEndpoints($id, $city);

        // Выполнить параллельные запросы (all-settled)
        $settled = $this->parallelExecutor->executeAllSettled($endpoints);

        // Проверить, все ли успешны
        if (!$this->parallelExecutor->allSuccessful($settled)) {
            // Есть ошибки — создать PartialAggregationError
            $successful = $this->parallelExecutor->getSuccessful($settled);
            $failed = $this->parallelExecutor->getFailed($settled);

            // Нормализовать успешные ответы
            $normalizedResponses = $this->normalizeResponses($successful);

            // Агрегировать успешные данные
            $aggregated = $strategy->aggregate($normalizedResponses);

            throw new PartialAggregationError(
                "Some endpoints failed during aggregation",
                successfulResponses: $aggregated,
                failedEndpoints: array_keys($failed),
                context: [
                    'objectType' => $objectType->value,
                    'id' => $id,
                    'totalEndpoints' => count($endpoints),
                    'successfulEndpoints' => count($successful),
                    'failedEndpoints' => count($failed),
                ]
            );
        }

        // Все успешны — нормализовать и агрегировать
        $successful = $this->parallelExecutor->getSuccessful($settled);
        $normalizedResponses = $this->normalizeResponses($successful);

        return $strategy->aggregate($normalizedResponses);
    }

    /**
     * Получить стратегию для типа объекта
     */
    private function getStrategy(ObjectType $objectType): ?DetailStrategy
    {
        return $this->strategies[$objectType->value] ?? null;
    }

    /**
     * Нормализовать ответы
     */
    private function normalizeResponses(array $responses): array
    {
        $normalized = [];

        foreach ($responses as $key => $response) {
            $normalized[$key] = $this->normalizer->normalize($response);
        }

        return $normalized;
    }
}
