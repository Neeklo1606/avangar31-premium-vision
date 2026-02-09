<?php

namespace App\Services\TrendAgent\Core\Errors;

/**
 * Ошибка: часть endpoint'ов при агрегации вернула ошибку
 * 
 * Используется для DetailService при агрегации данных из 22 endpoint'ов
 * Позволяет вернуть частичные данные вместо полного отказа
 */
class PartialAggregationError extends TrendAgentException
{
    private array $successfulResponses = [];
    private array $failedEndpoints = [];

    public function __construct(
        string $message,
        array $successfulResponses = [],
        array $failedEndpoints = [],
        array $context = []
    ) {
        parent::__construct($message, 0, null, $context);
        $this->successfulResponses = $successfulResponses;
        $this->failedEndpoints = $failedEndpoints;
    }

    public function isRetriable(): bool
    {
        return true; // Можно повторить только неудачные endpoint'ы
    }

    public function getSuccessfulResponses(): array
    {
        return $this->successfulResponses;
    }

    public function getFailedEndpoints(): array
    {
        return $this->failedEndpoints;
    }

    public function hasPartialData(): bool
    {
        return !empty($this->successfulResponses);
    }
}
