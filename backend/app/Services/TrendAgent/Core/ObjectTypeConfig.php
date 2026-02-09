<?php

namespace App\Services\TrendAgent\Core;

use App\Services\TrendAgent\Core\Contracts\ApiEndpoint;

/**
 * Конфигурация для типа объекта
 * 
 * Определяет:
 * - Какой API домен использовать
 * - Какие endpoint'ы для каталога, деталей, справочников
 * - Какие специальные параметры применять
 * - Какой формат справочников
 */
class ObjectTypeConfig
{
    /**
     * @param string $apiDomain Домен API (api.trendagent.ru, parkings-api.trendagent.ru)
     * @param string|null $apiVersion Версия API (v4_29, v1) или null
     * @param ApiEndpoint $catalogEndpoint Endpoint для получения списка
     * @param ApiEndpoint $detailEndpoint Endpoint для детальной информации
     * @param ApiEndpoint|null $dictionariesEndpoint Endpoint для справочников
     * @param string $dictionariesFormat Формат справочников (directories, enums, filters, filter)
     * @param array $specialParams Специальные параметры (например, room=30|40 для домов)
     * @param array $detailEndpoints Дополнительные endpoint'ы для детальной страницы
     * @param string|null $countEndpoint Endpoint для получения count (если отличается от catalog)
     * @param string|null $mapEndpoint Endpoint для карты
     */
    public function __construct(
        public readonly string $apiDomain,
        public readonly ?string $apiVersion,
        public readonly ApiEndpoint $catalogEndpoint,
        public readonly ApiEndpoint $detailEndpoint,
        public readonly ?ApiEndpoint $dictionariesEndpoint,
        public readonly string $dictionariesFormat,
        public readonly array $specialParams = [],
        public readonly array $detailEndpoints = [],
        public readonly ?string $countEndpoint = null,
        public readonly ?string $mapEndpoint = null
    ) {}

    /**
     * Получить базовый URL API
     */
    public function getBaseUrl(): string
    {
        $url = "https://{$this->apiDomain}";
        
        if ($this->apiVersion !== null) {
            $url .= "/{$this->apiVersion}";
        }
        
        return $url;
    }

    /**
     * Проверить, есть ли специальные параметры
     */
    public function hasSpecialParams(): bool
    {
        return !empty($this->specialParams);
    }

    /**
     * Получить специальные параметры
     */
    public function getSpecialParams(): array
    {
        return $this->specialParams;
    }

    /**
     * Проверить, есть ли дополнительные endpoint'ы для деталей
     */
    public function hasDetailEndpoints(): bool
    {
        return !empty($this->detailEndpoints);
    }

    /**
     * Получить все endpoint'ы для детальной страницы
     */
    public function getAllDetailEndpoints(): array
    {
        return array_merge(
            [$this->detailEndpoint],
            $this->detailEndpoints
        );
    }

    /**
     * Проверить, поддерживает ли карту
     */
    public function hasMapSupport(): bool
    {
        return $this->mapEndpoint !== null;
    }
}
