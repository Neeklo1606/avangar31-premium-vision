<?php

namespace App\Services\TrendAgent\Auth;

use App\Services\TrendAgent\Core\Errors\AuthExpiredError;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Менеджер JWT токенов для TrendAgent API
 *
 * Реализация по образцу проекта AL: SSO через sso.trend.tech + sso-api.trend.tech,
 * app_id в URL логина, phone+password+client=web, заголовки Origin/Referer,
 * извлечение токена из JSON, cookies и Location.
 *
 * Endpoint'ы:
 * - GET sso.trend.tech/login — опционально для получения app_id
 * - POST sso-api.trend.tech/v1/login?app_id=...&lang=ru — телефон + пароль
 * - GET sso-api.trend.tech/v1/auth_token/ — client_id + client_secret (запасной вариант)
 */
class AuthTokenManager
{
    private const SSO_DOMAIN = 'sso-api.trend.tech';
    private const TOKEN_CACHE_KEY = 'trendagent_auth_token';
    private const TOKEN_LIFETIME_SECONDS = 300;
    private const REFRESH_BEFORE_SECONDS = 60;

    private ?string $currentToken = null;
    private ?int $tokenExpiresAt = null;

    public function getValidToken(): string
    {
        $cached = $this->getFromCache();
        if ($cached !== null) {
            return $cached;
        }
        if ($this->currentToken !== null && !$this->isExpired()) {
            return $this->currentToken;
        }
        return $this->refreshToken();
    }

    /**
     * Обновить токен через SSO API (как в проекте AL).
     * Приоритет: 1) phone+password с app_id и заголовками, 2) client_id+client_secret.
     */
    public function refreshToken(): string
    {
        $ssoBase = 'https://' . config('trendagent.api.domains.sso', self::SSO_DOMAIN);
        $ssoUi = 'https://' . config('trendagent.api.domains.sso_ui', 'sso.trend.tech');
        $userPhone = config('trendagent.auth.user_phone', '');
        $userPassword = config('trendagent.auth.user_password', '');
        $clientId = config('trendagent.auth.client_id', '');
        $clientSecret = config('trendagent.auth.client_secret', '');
        $appId = config('trendagent.auth.app_id', '66d84f584c0168b8ccd281c3');

        $tryPhone = trim($userPhone) !== '' && trim($userPassword) !== '';
        $tryClient = trim($clientSecret) !== '' && $clientSecret !== 'your_client_secret_here';

        if (!$tryPhone && !$tryClient) {
            throw new AuthExpiredError(
                'Set in .env: TRENDAGENT_PHONE + TRENDAGENT_PASSWORD (or TRENDAGENT_USER_PHONE + TRENDAGENT_USER_PASSWORD), or TRENDAGENT_CLIENT_ID + TRENDAGENT_CLIENT_SECRET.'
            );
        }

        // 1) Логин по телефону и паролю (как в AL: app_id в URL, client=web, Origin/Referer)
        if ($tryPhone) {
            $phoneFormatted = $this->formatPhone($userPhone);
            $loginUrl = $ssoBase . '/v1/login?app_id=' . urlencode($appId) . '&lang=ru';

            $response = Http::timeout(15)
                ->withOptions(['allow_redirects' => false])
                ->asForm()
                ->withHeaders([
                    'Accept' => 'application/json, text/plain, */*',
                    'Accept-Language' => 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Origin' => $ssoUi,
                    'Referer' => $ssoUi . '/login?app_id=' . urlencode($appId),
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
                ])
                ->post($loginUrl, [
                    'phone' => $phoneFormatted,
                    'password' => $userPassword,
                    'client' => 'web',
                ]);

            $token = $this->parseTokenFromLoginResponse($response, $loginUrl);
            if ($token !== null) {
                return $token;
            }
            Log::warning('TrendAgent SSO login (phone) did not return token', ['status' => $response->status()]);
        }

        // 2) GET /v1/auth_token/?client_id=...&client_secret=...
        if ($tryClient) {
            $response = Http::timeout(15)
                ->withHeaders(['Accept' => 'application/json'])
                ->get($ssoBase . '/v1/auth_token/', [
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                ]);
            if ($response->successful()) {
                return $this->parseTokenFromResponse($response);
            }
        }

        // 3) POST /v1/login с client_id + client_secret
        if ($tryClient) {
            $response = Http::timeout(15)
                ->acceptJson()
                ->post($ssoBase . '/v1/login', [
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                ]);
            if ($response->successful()) {
                return $this->parseTokenFromResponse($response);
            }
        }

        throw new AuthExpiredError(
            'SSO auth failed. Use TRENDAGENT_PHONE + TRENDAGENT_PASSWORD or TRENDAGENT_CLIENT_ID + TRENDAGENT_CLIENT_SECRET.'
        );
    }

    /**
     * Форматирование телефона как в AL: +7XXXXXXXXXX
     */
    private function formatPhone(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);
        if (str_starts_with($phone, '8') && strlen($phone) === 11) {
            return '+7' . substr($phone, 1);
        }
        if (str_starts_with($phone, '7') && strlen($phone) === 11) {
            return '+' . $phone;
        }
        if (strlen($phone) === 10) {
            return '+7' . $phone;
        }
        return $phone;
    }

    /**
     * Извлечь токен из ответа логина (201, 302, cookies, Location) — как в AL.
     */
    private function parseTokenFromLoginResponse(Response $response, string $loginUrl): ?string
    {
        $status = $response->status();
        $body = $response->body();

        // Токен из JSON (201 Created или 200)
        if ($status === 201 || $status === 200) {
            $data = $response->json();
            if (is_array($data)) {
                $token = $data['auth_token'] ?? $data['token'] ?? $data['access_token']
                    ?? $data['data']['auth_token'] ?? $data['data']['token'] ?? null;
                if (!empty($token) && is_string($token)) {
                    $this->setTokenFromParsed($token, $response);
                    return $token;
                }
            }
        }

        // Редирект 302/301 — токен в Location или в Set-Cookie
        if ($status >= 300 && $status < 400) {
            $location = $response->header('Location');
            if ($location !== null && str_contains($location, 'auth_token=')) {
                parse_str(parse_url($location, PHP_URL_QUERY) ?? '', $params);
                $token = $params['auth_token'] ?? $params['access_token'] ?? null;
                if (!empty($token) && is_string($token)) {
                    $this->setTokenFromParsed($token, $response);
                    return $token;
                }
            }
            $tokenFromCookie = $this->extractTokenFromSetCookie($response);
            if ($tokenFromCookie !== null) {
                $this->setTokenFromParsed($tokenFromCookie, $response);
                return $tokenFromCookie;
            }
        }

        // Токен только в cookies (например при 403 с Set-Cookie)
        $tokenFromCookie = $this->extractTokenFromSetCookie($response);
        if ($tokenFromCookie !== null) {
            $this->setTokenFromParsed($tokenFromCookie, $response);
            return $tokenFromCookie;
        }

        return null;
    }

    private function extractTokenFromSetCookie(Response $response): ?string
    {
        $setCookies = $response->header('Set-Cookie');
        if (is_string($setCookies)) {
            $setCookies = [$setCookies];
        }
        if (!is_array($setCookies)) {
            return null;
        }
        foreach ($setCookies as $header) {
            if (stripos($header, 'auth_token') === false) {
                continue;
            }
            if (preg_match('/auth_token\s*=\s*([^;\s]+)/i', $header, $m)) {
                return trim($m[1], '"');
            }
        }
        return null;
    }

    private function setTokenFromParsed(string $token, Response $response): void
    {
        $data = $response->json();
        $expiresIn = is_array($data) ? ($data['expires_in'] ?? $data['data']['expires_in'] ?? null) : null;
        $expiresAt = is_numeric($expiresIn)
            ? time() + (int) $expiresIn
            : ($this->getExpirationFromToken($token) ?? time() + self::TOKEN_LIFETIME_SECONDS);
        $this->setToken($token, $expiresAt);
    }

    /**
     * Извлечь токен из ответа SSO и сохранить в кэш
     */
    private function parseTokenFromResponse(\Illuminate\Http\Client\Response $response): string
    {
        $data = $response->json();
        if (!is_array($data)) {
            throw new AuthExpiredError('SSO response is not JSON object');
        }

        $token = $data['auth_token'] ?? $data['token'] ?? $data['access_token']
            ?? ($data['data']['auth_token'] ?? $data['data']['token'] ?? null);
        if (empty($token) || !is_string($token)) {
            Log::warning('TrendAgent SSO response missing token', ['keys' => array_keys($data)]);
            throw new AuthExpiredError('SSO response does not contain auth_token/token.');
        }

        $expiresIn = $data['expires_in'] ?? $data['data']['expires_in'] ?? null;
        $expiresAt = is_numeric($expiresIn)
            ? time() + (int) $expiresIn
            : ($this->getExpirationFromToken($token) ?? time() + self::TOKEN_LIFETIME_SECONDS);

        $this->setToken($token, $expiresAt);
        return $token;
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
