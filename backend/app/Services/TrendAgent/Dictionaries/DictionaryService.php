<?php

namespace App\Services\TrendAgent\Dictionaries;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Router\ObjectTypeResolver;
use App\Services\TrendAgent\Router\EndpointBuilder;
use App\Services\TrendAgent\Http\HttpClient;
use App\Services\TrendAgent\Http\RetryManager;

/**
 * Унифицированный сервис для работы со справочниками
 * 
 * Ответственность:
 * - Получение справочников для типа объекта
 * - Кэширование
 * - Нормализация разных форматов
 * 
 * Используется:
 * - FilterBuilder для получения доступных значений фильтров
 * - CatalogService для дополнительных данных
 * - DetailService для расшифровки ID'ов
 */
class DictionaryService
{
    public function __construct(
        private readonly ObjectTypeResolver $resolver,
        private readonly EndpointBuilder $endpointBuilder,
        private readonly HttpClient $httpClient,
        private readonly RetryManager $retryManager,
        private readonly DictionaryAdapter $adapter,
        private readonly CacheManager $cacheManager
    ) {}

    /**
     * Получить справочники для типа объекта
     * 
     * @param ObjectType $objectType Тип объекта
     * @param string $city ID города
     * @param array|null $types Конкретные справочники (если null — все)
     * @return array Нормализованные справочники
     */
    public function getDictionaries(
        ObjectType $objectType,
        string $city,
        ?array $types = null
    ): array {
        $cacheKey = $this->buildCacheKey($objectType, $city, $types);

        return $this->cacheManager->rememberDictionary(
            $cacheKey,
            fn() => $this->fetchDictionaries($objectType, $city, $types)
        );
    }

    /**
     * Получить конкретный справочник
     */
    public function getDictionary(
        ObjectType $objectType,
        string $dictionaryName,
        string $city
    ): array {
        $allDictionaries = $this->getDictionaries($objectType, $city, [$dictionaryName]);

        return $allDictionaries[$dictionaryName] ?? [
            'key' => $dictionaryName,
            'items' => [],
        ];
    }

    /**
     * Получить значения для фильтра
     * 
     * Синоним getDictionary для использования в FilterBuilder
     */
    public function getFilterValues(
        ObjectType $objectType,
        string $filterName,
        string $city
    ): array {
        $dictionary = $this->getDictionary($objectType, $filterName, $city);
        return $dictionary['items'] ?? [];
    }

    /**
     * Инвалидировать кэш справочников для типа объекта
     */
    public function invalidate(ObjectType $objectType, string $city): void
    {
        $this->cacheManager->forgetDictionariesForType($objectType->value . ':' . $city);
    }

    /**
     * Выполнить запрос справочников
     */
    private function fetchDictionaries(
        ObjectType $objectType,
        string $city,
        ?array $types
    ): array {
        $config = $this->resolver->getConfig($objectType);
        $endpoint = $config->dictionariesEndpoint;

        if ($endpoint === null) {
            // Для типов без справочников возвращаем пустой массив
            return [];
        }

        // Построить URL с параметрами
        $queryParams = ['city' => $city];
        
        if ($types !== null) {
            $queryParams['types'] = implode(',', $types);
        }

        $url = $this->endpointBuilder->buildPublic(
            $endpoint,
            [],
            $queryParams,
            $city
        );

        // Выполнить запрос с retry
        $response = $this->retryManager->retry(
            fn() => $this->httpClient->get($url)
        );

        // Нормализовать ответ
        $rawData = $response->json();
        
        return $this->adapter->normalize(
            $rawData,
            $config->dictionariesFormat,
            $types[0] ?? null
        );
    }

    /**
     * Построить ключ кэша
     */
    private function buildCacheKey(
        ObjectType $objectType,
        string $city,
        ?array $types
    ): string {
        $key = $objectType->value . ':' . $city;

        if ($types !== null) {
            $key .= ':' . implode(',', $types);
        }

        return $key;
    }
}
