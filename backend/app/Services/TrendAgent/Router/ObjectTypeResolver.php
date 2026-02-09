<?php

namespace App\Services\TrendAgent\Router;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\ObjectTypeConfig;
use App\Services\TrendAgent\Core\Contracts\ApiEndpoint;

/**
 * Резолвер конфигурации по типу объекта
 * 
 * Ответственность:
 * - Маршрутизация на правильный API домен по типу объекта
 * - Получение конфигурации endpoint'ов
 * - Применение специальных параметров
 * 
 * ЦЕНТРАЛЬНАЯ ТОЧКА КОНФИГУРАЦИИ:
 * Все маппинги ObjectType → API находятся здесь
 */
class ObjectTypeResolver
{
    private array $configs = [];

    public function __construct()
    {
        $this->initializeConfigs();
    }

    /**
     * Получить конфигурацию для типа объекта
     */
    public function getConfig(ObjectType $objectType): ObjectTypeConfig
    {
        if (!isset($this->configs[$objectType->value])) {
            throw new \InvalidArgumentException("No configuration for object type: {$objectType->value}");
        }

        return $this->configs[$objectType->value];
    }

    /**
     * Получить catalog endpoint для типа объекта
     */
    public function getCatalogEndpoint(ObjectType $objectType): ApiEndpoint
    {
        return $this->getConfig($objectType)->catalogEndpoint;
    }

    /**
     * Получить detail endpoint для типа объекта
     */
    public function getDetailEndpoint(ObjectType $objectType): ApiEndpoint
    {
        return $this->getConfig($objectType)->detailEndpoint;
    }

    /**
     * Получить dictionaries endpoint для типа объекта
     */
    public function getDictionariesEndpoint(ObjectType $objectType): ?ApiEndpoint
    {
        return $this->getConfig($objectType)->dictionariesEndpoint;
    }

    /**
     * Применить специальные параметры для типа объекта
     * 
     * Например: добавить room=30 и room=40 для HOUSES
     */
    public function applySpecialParams(ObjectType $objectType, array $params): array
    {
        $config = $this->getConfig($objectType);
        
        if (!$config->hasSpecialParams()) {
            return $params;
        }

        return array_merge($params, $config->getSpecialParams());
    }

    /**
     * Инициализация конфигураций для всех типов объектов
     * 
     * ЗДЕСЬ ХРАНЯТСЯ ВСЕ МАППИНГИ API
     */
    private function initializeConfigs(): void
    {
        // BLOCKS (Жилые комплексы)
        $this->configs[ObjectType::BLOCKS->value] = new ObjectTypeConfig(
            apiDomain: 'api.trendagent.ru',
            apiVersion: 'v4_29',
            catalogEndpoint: new ApiEndpoint(
                domain: 'api.trendagent.ru',
                version: 'v4_29',
                path: '/blocks/search/',
                requiredParams: ['city', 'auth_token'],
                optionalParams: ['show_type', 'sort', 'sort_order', 'count', 'offset']
            ),
            detailEndpoint: new ApiEndpoint(
                domain: 'api.trendagent.ru',
                version: 'v4_29',
                path: '/blocks/{id}/unified/',
                pathParams: ['id'],
                requiredParams: ['city', 'auth_token']
            ),
            dictionariesEndpoint: new ApiEndpoint(
                domain: 'apartment-api.trendagent.ru',
                version: 'v1',
                path: '/directories',
                requiredParams: ['types', 'city']
            ),
            dictionariesFormat: 'directories',
            countEndpoint: '/blocks/search/count/',
            mapEndpoint: '/blocks/search/?show_type=map'
        );

        // APARTMENTS (Квартиры)
        $this->configs[ObjectType::APARTMENTS->value] = new ObjectTypeConfig(
            apiDomain: 'api.trendagent.ru',
            apiVersion: 'v4_29',
            catalogEndpoint: new ApiEndpoint(
                domain: 'api.trendagent.ru',
                version: 'v4_29',
                path: '/apartments/search/',
                requiredParams: ['city', 'auth_token'],
                optionalParams: ['sort', 'sort_order', 'count', 'offset', 'room', 'block_id']
            ),
            detailEndpoint: new ApiEndpoint(
                domain: 'api.trendagent.ru',
                version: 'v4_29',
                path: '/apartments/{id}/',
                pathParams: ['id'],
                requiredParams: ['city', 'auth_token']
            ),
            dictionariesEndpoint: new ApiEndpoint(
                domain: 'apartment-api.trendagent.ru',
                version: 'v1',
                path: '/directories',
                requiredParams: ['types', 'city']
            ),
            dictionariesFormat: 'directories'
        );

        // PARKING (Машиноместа)
        $this->configs[ObjectType::PARKING->value] = new ObjectTypeConfig(
            apiDomain: 'parkings-api.trendagent.ru',
            apiVersion: null,
            catalogEndpoint: new ApiEndpoint(
                domain: 'parkings-api.trendagent.ru',
                version: null,
                path: '/search/places/',
                requiredParams: ['city'],
                optionalParams: ['count', 'offset', 'sort', 'sort_order', 'number']
            ),
            detailEndpoint: new ApiEndpoint(
                domain: 'parkings-api.trendagent.ru',
                version: null,
                path: '/parkings/{id}/',
                pathParams: ['id'],
                requiredParams: ['city']
            ),
            dictionariesEndpoint: new ApiEndpoint(
                domain: 'parkings-api.trendagent.ru',
                version: null,
                path: '/enums/{type}',
                pathParams: ['type'],
                requiredParams: ['city']
            ),
            dictionariesFormat: 'enums',
            countEndpoint: '/search/blocks'
        );

        // HOUSES (Дома = квартиры с room=30|40)
        $this->configs[ObjectType::HOUSES->value] = new ObjectTypeConfig(
            apiDomain: 'api.trendagent.ru',
            apiVersion: 'v4_29',
            catalogEndpoint: new ApiEndpoint(
                domain: 'api.trendagent.ru',
                version: 'v4_29',
                path: '/apartments/search/',
                requiredParams: ['city', 'auth_token', 'room'],
                optionalParams: ['sort', 'sort_order', 'count', 'offset']
            ),
            detailEndpoint: new ApiEndpoint(
                domain: 'api.trendagent.ru',
                version: 'v4_29',
                path: '/apartments/{id}/',
                pathParams: ['id'],
                requiredParams: ['city', 'auth_token']
            ),
            dictionariesEndpoint: new ApiEndpoint(
                domain: 'apartment-api.trendagent.ru',
                version: 'v1',
                path: '/directories',
                requiredParams: ['types', 'city']
            ),
            dictionariesFormat: 'directories',
            specialParams: [
                'room' => [30, 40] // Коттеджи + Таунхаусы
            ]
        );

        // PLOTS (Участки)
        $this->configs[ObjectType::PLOTS->value] = new ObjectTypeConfig(
            apiDomain: 'house-api.trendagent.ru',
            apiVersion: 'v1',
            catalogEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/search/plots',
                requiredParams: ['city'],
                optionalParams: ['count', 'offset', 'sort_order', 'sort_type']
            ),
            detailEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/plots/{id}',
                pathParams: ['id'],
                requiredParams: ['city']
            ),
            dictionariesEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/filter/plots',
                requiredParams: ['city']
            ),
            dictionariesFormat: 'filter',
            countEndpoint: '/search/villages?count=1'
        );

        // COMMERCE (Коммерческая недвижимость)
        $this->configs[ObjectType::COMMERCE->value] = new ObjectTypeConfig(
            apiDomain: 'commerce-api.trendagent.ru',
            apiVersion: null,
            catalogEndpoint: new ApiEndpoint(
                domain: 'commerce-api.trendagent.ru',
                version: null,
                path: '/search/premises',
                requiredParams: ['city'],
                optionalParams: ['count', 'offset', 'sort', 'sort_order', 'number']
            ),
            detailEndpoint: new ApiEndpoint(
                domain: 'commerce-api.trendagent.ru',
                version: null,
                path: '/premises/{id}',
                pathParams: ['id'],
                requiredParams: ['city']
            ),
            dictionariesEndpoint: new ApiEndpoint(
                domain: 'commerce-api.trendagent.ru',
                version: null,
                path: '/filters',
                requiredParams: ['name', 'city']
            ),
            dictionariesFormat: 'filters'
        );

        // HOUSE_PROJECTS (Проекты домов)
        $this->configs[ObjectType::HOUSE_PROJECTS->value] = new ObjectTypeConfig(
            apiDomain: 'house-api.trendagent.ru',
            apiVersion: 'v1',
            catalogEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/projects/search',
                requiredParams: ['city'],
                optionalParams: ['count', 'offset', 'sort_order', 'sort_type']
            ),
            detailEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/projects/{id}',
                pathParams: ['id'],
                requiredParams: ['city']
            ),
            dictionariesEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/filter',
                requiredParams: ['city']
            ),
            dictionariesFormat: 'filter'
        );

        // VILLAGES (Поселки)
        $this->configs[ObjectType::VILLAGES->value] = new ObjectTypeConfig(
            apiDomain: 'house-api.trendagent.ru',
            apiVersion: 'v1',
            catalogEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/search/villages',
                requiredParams: ['city'],
                optionalParams: ['count', 'offset', 'sort_order', 'sort_type']
            ),
            detailEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/villages/{id}',
                pathParams: ['id'],
                requiredParams: ['city']
            ),
            dictionariesEndpoint: new ApiEndpoint(
                domain: 'house-api.trendagent.ru',
                version: 'v1',
                path: '/filter',
                requiredParams: ['city']
            ),
            dictionariesFormat: 'filter'
        );
    }
}
