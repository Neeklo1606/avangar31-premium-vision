<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Detail\DetailService;
use App\Services\TrendAgent\Dictionaries\DictionaryService;
use App\Services\TrendAgent\Media\MediaService;

/**
 * TrendAgent Facade
 * 
 * @method static \App\Services\TrendAgent\Core\Contracts\CatalogResult getCatalog(\App\Services\TrendAgent\Core\ObjectType $objectType, array $filters = [], int $page = 1, int $pageSize = 20)
 * @method static \App\Services\TrendAgent\Core\Contracts\DetailResult getDetail(\App\Services\TrendAgent\Core\ObjectType $objectType, string $identifier, bool $useSlug = false, bool $useAggregation = true)
 * @method static int getCount(\App\Services\TrendAgent\Core\ObjectType $objectType, array $filters = [])
 * @method static array getDictionary(\App\Services\TrendAgent\Core\ObjectType $objectType, string $dictionaryKey)
 * @method static array getAllDictionaries(\App\Services\TrendAgent\Core\ObjectType $objectType)
 * @method static \App\Services\TrendAgent\Core\Contracts\MediaCollection getMedia(\App\Services\TrendAgent\Core\ObjectType $objectType, string $entityId)
 * 
 * @see CatalogService
 * @see DetailService
 * @see DictionaryService
 * @see MediaService
 */
class TrendAgent extends Facade
{
    /**
     * Получить accessor для facade
     * 
     * Возвращает CatalogService как основной сервис
     * Для других сервисов используйте прямой DI
     */
    protected static function getFacadeAccessor(): string
    {
        return CatalogService::class;
    }

    /**
     * Хелпер для получения DetailService
     */
    public static function detail(): DetailService
    {
        return app(DetailService::class);
    }

    /**
     * Хелпер для получения DictionaryService
     */
    public static function dictionaries(): DictionaryService
    {
        return app(DictionaryService::class);
    }

    /**
     * Хелпер для получения MediaService
     */
    public static function media(): MediaService
    {
        return app(MediaService::class);
    }
}
