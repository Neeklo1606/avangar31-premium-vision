<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Dictionaries\DictionaryService;
use App\Services\TrendAgent\Core\ObjectType;
use App\Http\Resources\TrendAgent\CatalogCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Контроллер для работы с каталогами объектов недвижимости
 * 
 * ПРИМЕР интеграции TrendAgent через Laravel DI
 */
class CatalogController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService,
        private readonly DictionaryService $dictionaryService
    ) {}

    /**
     * Получить список объектов
     * 
     * @param Request $request
     * @return JsonResponse
     * 
     * GET /api/catalog/{type}?page=1&per_page=20&filter[price_from]=1000000
     * 
     * Примеры:
     * - GET /api/catalog/blocks
     * - GET /api/catalog/apartments?filter[rooms]=2&filter[price_from]=5000000
     * - GET /api/catalog/parking?filter[block_id]=123
     */
    public function index(Request $request, string $type): JsonResponse
    {
        try {
            // Парсим тип объекта
            $objectType = ObjectType::from($type);

            // Извлекаем фильтры из query параметров
            $filters = $request->input('filter', []);

            // Pagination
            $page = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 20);

            // Получаем данные из TrendAgent
            $result = $this->catalogService->getCatalog(
                objectType: $objectType,
                filters: $filters,
                page: $page,
                pageSize: $perPage
            );

            // Получаем словари для фронтенда (опционально)
            $includeDictionaries = $request->boolean('with_dictionaries', false);
            $dictionaries = $includeDictionaries 
                ? $this->dictionaryService->getAllDictionaries($objectType)
                : null;

            // Возвращаем через Resource Collection
            return new CatalogCollection($result, $objectType, $dictionaries);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type',
                'message' => $e->getMessage(),
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Catalog fetch failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Получить количество объектов без пагинации
     * 
     * GET /api/catalog/{type}/count?filter[price_from]=1000000
     */
    public function count(Request $request, string $type): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);
            $filters = $request->input('filter', []);

            $count = $this->catalogService->getCount($objectType, $filters);

            return response()->json([
                'success' => true,
                'data' => [
                    'count' => $count,
                    'type' => $objectType->value,
                    'filters' => $filters,
                ],
            ]);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Count failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Поиск по нескольким типам объектов
     * 
     * POST /api/catalog/search
     * {
     *   "types": ["blocks", "apartments"],
     *   "filters": {"price_from": 1000000},
     *   "page": 1,
     *   "per_page": 20
     * }
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'types' => 'required|array',
            'types.*' => 'string',
            'filters' => 'array',
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100',
        ]);

        try {
            $types = $request->input('types');
            $filters = $request->input('filters', []);
            $page = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 20);

            $results = [];

            foreach ($types as $typeString) {
                $objectType = ObjectType::from($typeString);

                $result = $this->catalogService->getCatalog(
                    objectType: $objectType,
                    filters: $filters,
                    page: $page,
                    pageSize: $perPage
                );

                $results[$typeString] = [
                    'items' => $result->items,
                    'total' => $result->total,
                    'pagination' => $result->pagination,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $results,
            ]);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type in types array',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Search failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
