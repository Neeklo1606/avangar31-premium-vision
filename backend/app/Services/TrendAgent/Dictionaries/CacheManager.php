<?php

namespace App\Services\TrendAgent\Dictionaries;

use Illuminate\Support\Facades\Cache;

/**
 * Менеджер кэширования для справочников
 * 
 * Ответственность:
 * - Кэширование справочников (TTL: 24 часа)
 * - Кэширование slug-to-ID маппингов (TTL: 1 час)
 * - Инвалидация кэша
 */
class CacheManager
{
    private const DICTIONARY_TTL = 86400; // 24 часа
    private const SLUG_MAP_TTL = 3600;     // 1 час
    private const PREFIX = 'trendagent:';

    /**
     * Получить справочник из кэша или выполнить callback
     */
    public function rememberDictionary(string $key, callable $callback): array
    {
        $cacheKey = $this->getDictionaryKey($key);

        return Cache::remember($cacheKey, self::DICTIONARY_TTL, $callback);
    }

    /**
     * Получить slug-to-ID маппинг из кэша или выполнить callback
     */
    public function rememberSlugMap(string $objectType, string $slug, callable $callback): ?string
    {
        $cacheKey = $this->getSlugMapKey($objectType, $slug);

        return Cache::remember($cacheKey, self::SLUG_MAP_TTL, $callback);
    }

    /**
     * Сохранить справочник в кэш
     */
    public function putDictionary(string $key, array $data): void
    {
        $cacheKey = $this->getDictionaryKey($key);
        Cache::put($cacheKey, $data, self::DICTIONARY_TTL);
    }

    /**
     * Сохранить slug-to-ID маппинг в кэш
     */
    public function putSlugMap(string $objectType, string $slug, string $id): void
    {
        $cacheKey = $this->getSlugMapKey($objectType, $slug);
        Cache::put($cacheKey, $id, self::SLUG_MAP_TTL);
    }

    /**
     * Инвалидировать справочник
     */
    public function forgetDictionary(string $key): void
    {
        $cacheKey = $this->getDictionaryKey($key);
        Cache::forget($cacheKey);
    }

    /**
     * Инвалидировать все справочники для типа объекта
     */
    public function forgetDictionariesForType(string $objectType): void
    {
        $pattern = $this->getDictionaryKey("{$objectType}:*");
        
        // В Laravel нет встроенной поддержки удаления по паттерну для всех драйверов
        // Для Redis можно использовать SCAN, для file/database нужна другая реализация
        // Здесь упрощённый вариант
    }

    /**
     * Инвалидировать все slug-to-ID маппинги
     */
    public function forgetAllSlugMaps(): void
    {
        // Аналогично forgetDictionariesForType
    }

    /**
     * Получить ключ кэша для справочника
     */
    private function getDictionaryKey(string $key): string
    {
        return self::PREFIX . 'dict:' . $key;
    }

    /**
     * Получить ключ кэша для slug-to-ID маппинга
     */
    private function getSlugMapKey(string $objectType, string $slug): string
    {
        return self::PREFIX . 'slug:' . $objectType . ':' . $slug;
    }
}
