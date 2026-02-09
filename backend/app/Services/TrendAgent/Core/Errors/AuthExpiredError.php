<?php

namespace App\Services\TrendAgent\Core\Errors;

/**
 * Ошибка: auth_token истёк или невалиден
 * 
 * Должна вызывать автоматическое обновление токена
 */
class AuthExpiredError extends TrendAgentException
{
    public function isRetriable(): bool
    {
        return true; // После обновления токена можно повторить
    }
}
