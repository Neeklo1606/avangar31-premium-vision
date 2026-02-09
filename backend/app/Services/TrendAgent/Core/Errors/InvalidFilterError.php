<?php

namespace App\Services\TrendAgent\Core\Errors;

/**
 * Ошибка: неверный фильтр или значение фильтра
 * 
 * Возникает при:
 * - Использовании фильтра не применимого к типу объекта
 * - Передаче невалидного значения фильтра
 */
class InvalidFilterError extends TrendAgentException
{
    public function isRetriable(): bool
    {
        return false; // Нужно исправить фильтр
    }
}
