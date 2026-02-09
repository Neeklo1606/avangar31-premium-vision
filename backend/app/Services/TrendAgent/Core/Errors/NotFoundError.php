<?php

namespace App\Services\TrendAgent\Core\Errors;

/**
 * Ошибка: объект не найден
 * 
 * Возникает при:
 * - Запросе несуществующего ID
 * - Запросе несуществующего slug
 */
class NotFoundError extends TrendAgentException
{
    public function isRetriable(): bool
    {
        return false; // Объекта нет, повтор бесполезен
    }
}
