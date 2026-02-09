<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Dictionaries\DictionaryService;
use App\Services\TrendAgent\Filters\FilterBuilder;
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
    private const DEFAULT_CITY = '58c665588b6aa52311afa01b'; // СПб

    public function __construct(
        private readonly CatalogService $catalogService,
        private readonly DictionaryService $dictionaryService,
        private readonly FilterBuilder $filterBuilder
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
            $objectType = ObjectType::from($type);
            $city = $request->input('city', self::DEFAULT_CITY);
            $filters = $request->input('filter', []);
            $page = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 20);

            $filterSet = $this->filterBuilder->createFromArray($objectType, $filters);

            $result = $this->catalogService->getCatalog(
                objectType: $objectType,
                city: $city,
                filters: $filterSet,
                page: $page,
                pageSize: $perPage
            );

            $includeDictionaries = $request->boolean('with_dictionaries', false);
            $dictionaries = $includeDictionaries 
                ? $this->dictionaryService->getAllDictionaries($objectType, $city)
                : null;

            // Возвращаем через Resource Collection
            return new CatalogCollection($result, $objectType, $dictionaries);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type',
                'message' => $e->getMessage(),
            ], 400);

        } catch (\Throwable $e) {
            // При сбое внешнего API отдаём 200 с пустым списком, чтобы админка не падала
            $page = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 20);
            return response()->json([
                'data' => [],
                'meta' => [
                    'total' => 0,
                    'page' => $page,
                    'per_page' => $perPage,
                    'total_pages' => 1,
                    'has_more' => false,
                    'object_type' => $type,
                    'city' => $request->input('city', self::DEFAULT_CITY),
                ],
                'filters' => [],
                'dictionaries' => null,
            ]);
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
            $city = $request->input('city', self::DEFAULT_CITY);
            $filters = $request->input('filter', []);
            $filterSet = $this->filterBuilder->createFromArray($objectType, $filters);

            $count = $this->catalogService->getCount($objectType, $city, $filterSet);

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
                'data' => ['count' => 0, 'type' => $type, 'filters' => []],
            ], 200);
        } catch (\Exception $e) {
            // При ошибке (нет .env, API недоступен) отдаём 200 с count: 0, чтобы дашборд не падал
            return response()->json([
                'success' => false,
                'data' => [
                    'count' => 0,
                    'type' => $type,
                    'filters' => $request->input('filter', []),
                ],
            ], 200);
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
            $city = $request->input('city', self::DEFAULT_CITY);
            $filters = $request->input('filters', []);
            $page = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 20);

            $results = [];

            foreach ($types as $typeString) {
                $objectType = ObjectType::from($typeString);
                $filterSet = $this->filterBuilder->createFromArray($objectType, $filters);

                $result = $this->catalogService->getCatalog(
                    objectType: $objectType,
                    city: $city,
                    filters: $filterSet,
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
