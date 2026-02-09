<?php

namespace App\Services\TrendAgent\Auth;

use App\Services\TrendAgent\Core\Errors\AuthExpiredError;
use Illuminate\Support\Facades\Cache;

/**
 * Менеджер JWT токенов для TrendAgent API
 * 
 * Ответственность:
 * - Получение auth_token через SSO
 * - Автоматическое обновление токена
 * - Проверка валидности
 * - Кэширование токена
 * 
 * Lifecycle:
 * - Токен живёт ~5 минут
 * - Обновляется автоматически за 1 минуту до истечения
 * - Кэшируется между запросами
 * 
 * Endpoint'ы:
 * - POST sso-api.trend.tech/v1/login
 * - GET sso-api.trend.tech/v1/status
 * - GET sso-api.trend.tech/v1/auth_token/
 */
class AuthTokenManager
{
    private const SSO_DOMAIN = 'sso-api.trend.tech';
    private const TOKEN_CACHE_KEY = 'trendagent_auth_token';
    private const TOKEN_LIFETIME_SECONDS = 300; // 5 минут
    private const REFRESH_BEFORE_SECONDS = 60;  // Обновлять за 1 минуту до истечения

    private ?string $currentToken = null;
    private ?int $tokenExpiresAt = null;

    /**
     * Получить валидный auth_token
     * 
     * Если токен истёк или отсутствует — получает новый
     * 
     * @throws AuthExpiredError если не удалось получить токен
     */
    public function getValidToken(): string
    {
        // Попытка получить из кэша
        $cached = $this->getFromCache();
        if ($cached !== null) {
            return $cached;
        }

        // Попытка использовать текущий токен
        if ($this->currentToken !== null && !$this->isExpired()) {
            return $this->currentToken;
        }

        // Получить новый токен
        return $this->refreshToken();
    }

    /**
     * Принудительно обновить токен
     * 
     * @throws AuthExpiredError если не удалось получить токен
     */
    public function refreshToken(): string
    {
        // Этот метод будет вызывать HTTP endpoint
        // Реализация будет добавлена после HttpClient
        
        throw new AuthExpiredError('Token refresh not implemented yet');
    }

    /**
     * Проверить, истёк ли текущий токен
     */
    public function isExpired(): bool
    {
        if ($this->tokenExpiresAt === null) {
            return true;
        }

        $now = time();
        $refreshAt = $this->tokenExpiresAt - self::REFRESH_BEFORE_SECONDS;

        return $now >= $refreshAt;
    }

    /**
     * Установить токен вручную (для тестирования или внешней авторизации)
     */
    public function setToken(string $token, ?int $expiresAt = null): void
    {
        $this->currentToken = $token;
        $this->tokenExpiresAt = $expiresAt ?? (time() + self::TOKEN_LIFETIME_SECONDS);
        
        $this->saveToCache($token, $this->tokenExpiresAt);
    }

    /**
     * Инвалидировать текущий токен
     */
    public function invalidate(): void
    {
        $this->currentToken = null;
        $this->tokenExpiresAt = null;
        
        Cache::forget(self::TOKEN_CACHE_KEY);
    }

    /**
     * Получить время до истечения токена (в секундах)
     */
    public function getTimeToExpiry(): ?int
    {
        if ($this->tokenExpiresAt === null) {
            return null;
        }

        return max(0, $this->tokenExpiresAt - time());
    }

    /**
     * Декодировать JWT токен и получить payload
     */
    public function decodeToken(string $token): array
    {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new AuthExpiredError('Invalid JWT token format');
        }

        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
        
        return json_decode($payload, true) ?? [];
    }

    /**
     * Получить exp (expiration) из токена
     */
    public function getExpirationFromToken(string $token): ?int
    {
        try {
            $payload = $this->decodeToken($token);
            return $payload['exp'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Сохранить токен в кэш
     */
    private function saveToCache(string $token, int $expiresAt): void
    {
        $ttl = $expiresAt - time();
        
        if ($ttl > 0) {
            Cache::put(self::TOKEN_CACHE_KEY, [
                'token' => $token,
                'expires_at' => $expiresAt,
            ], $ttl);
        }
    }

    /**
     * Получить токен из кэша
     */
    private function getFromCache(): ?string
    {
        $cached = Cache::get(self::TOKEN_CACHE_KEY);
        
        if ($cached === null) {
            return null;
        }

        $this->currentToken = $cached['token'];
        $this->tokenExpiresAt = $cached['expires_at'];

        if ($this->isExpired()) {
            $this->invalidate();
            return null;
        }

        return $this->currentToken;
    }
}
