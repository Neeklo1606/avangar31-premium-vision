<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\DetailController;
use App\Http\Controllers\Api\DictionaryController;

/*
|--------------------------------------------------------------------------
| TrendAgent API Routes
|--------------------------------------------------------------------------
|
| Примеры маршрутов для TrendAgent API интеграции
| 
| Для использования добавьте в routes/api.php:
| require __DIR__.'/trendagent.php';
|
*/

Route::prefix('trendagent')->name('trendagent.')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Catalog Routes (списки объектов)
    |--------------------------------------------------------------------------
    */
    Route::prefix('catalog')->name('catalog.')->group(function () {
        // Получить количество объектов (до {type}, чтобы не перехватывалось как type=blocks/count)
        Route::get('{type}/count', [CatalogController::class, 'count'])
            ->name('count');

        // Получить список объектов определённого типа
        Route::get('{type}', [CatalogController::class, 'index'])
            ->name('index');

        // Поиск по нескольким типам
        Route::post('search', [CatalogController::class, 'search'])
            ->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | Detail Routes (детальные страницы)
    |--------------------------------------------------------------------------
    */
    Route::prefix('{type}')->name('detail.')->group(function () {
        // Получить детальную информацию по ID
        Route::get('{id}', [DetailController::class, 'show'])
            ->name('show')
            ->where('id', '[0-9a-f]+');

        // Получить детальную информацию по slug
        Route::get('by-slug/{slug}', [DetailController::class, 'showBySlug'])
            ->name('by-slug');

        // Получить медиа для объекта
        Route::get('{id}/media', [DetailController::class, 'media'])
            ->name('media');

        // Batch получение по нескольким ID
        Route::post('batch', [DetailController::class, 'batch'])
            ->name('batch');
    });

    /*
    |--------------------------------------------------------------------------
    | Dictionary Routes (справочники)
    |--------------------------------------------------------------------------
    */
    Route::prefix('dictionaries')->name('dictionaries.')->group(function () {
        // Получить все справочники для типа
        Route::get('{type}', [DictionaryController::class, 'all'])
            ->name('all');

        // Получить конкретный справочник
        Route::get('{type}/{key}', [DictionaryController::class, 'show'])
            ->name('show');
    });

});

/*
|--------------------------------------------------------------------------
| Примеры использования
|--------------------------------------------------------------------------
|
| GET /api/trendagent/catalog/blocks
| GET /api/trendagent/catalog/apartments?page=2&per_page=50
| GET /api/trendagent/catalog/apartments?filter[rooms]=2&filter[price_from]=5000000
| 
| POST /api/trendagent/catalog/search
| {
|   "types": ["blocks", "apartments"],
|   "filters": {"price_from": 1000000}
| }
|
| GET /api/trendagent/blocks/59fc27538bcb2468a6174402
| GET /api/trendagent/blocks/59fc27538bcb2468a6174402?with_media=true
| GET /api/trendagent/blocks/by-slug/villa-marina
| GET /api/trendagent/blocks/59fc27538bcb2468a6174402/media
|
| POST /api/trendagent/apartments/batch
| {
|   "ids": ["id1", "id2"],
|   "with_aggregation": true
| }
|
| GET /api/trendagent/dictionaries/blocks
| GET /api/trendagent/dictionaries/apartments/rooms
|
*/
