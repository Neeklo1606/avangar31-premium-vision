<?php

namespace App\Services\TrendAgent\Core\Errors;

use Exception;

/**
 * Базовое исключение для всех ошибок TrendAgent API
 */
abstract class TrendAgentException extends Exception
{
    protected array $context = [];

    public function __construct(string $message = "", int $code = 0, ?\Throwable $previous = null, array $context = [])
    {
        parent::__construct($message, $code, $previous);
        $this->context = $context;
    }

    /**
     * Получить контекст ошибки
     */
    public function getContext(): array
    {
        return $this->context;
    }

    /**
     * Добавить контекст
     */
    public function withContext(array $context): self
    {
        $this->context = array_merge($this->context, $context);
        return $this;
    }

    /**
     * Проверить, можно ли повторить запрос
     */
    abstract public function isRetriable(): bool;
}
