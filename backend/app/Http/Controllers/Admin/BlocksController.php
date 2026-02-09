<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Detail\DetailService;
use App\Services\TrendAgent\Dictionaries\DictionaryService;
use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Errors\NotFoundError;
use App\Http\Resources\TrendAgent\CatalogCollection;
use App\Http\Resources\TrendAgent\DetailResource;
use Illuminate\Http\Request;

/**
 * Admin Blocks Controller
 * 
 * Управление ЖК (жилыми комплексами)
 */
class BlocksController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService,
        private readonly DetailService $detailService,
        private readonly DictionaryService $dictionaryService
    ) {}

    /**
     * Список ЖК
     */
    public function index(Request $request)
    {
        $cityId = $request->input('city', config('trendagent.default_city'));
        $page = (int) $request->input('page', 1);
        $perPage = 20;
        
        // Фильтры
        $filters = [
            'city' => $cityId,
        ];
        
        if ($request->filled('search')) {
            $filters['search'] = $request->input('search');
        }
        
        if ($request->filled('class')) {
            $filters['class'] = $request->input('class');
        }
        
        if ($request->filled('status')) {
            $filters['status'] = $request->input('status');
        }
        
        if ($request->filled('price_from')) {
            $filters['price_from'] = $request->input('price_from');
        }
        
        if ($request->filled('price_to')) {
            $filters['price_to'] = $request->input('price_to');
        }
        
        try {
            // Получаем данные
            $result = $this->catalogService->getCatalog(
                objectType: ObjectType::BLOCKS,
                filters: $filters,
                page: $page,
                pageSize: $perPage
            );
            
            // Получаем справочники
            $dictionaries = $this->dictionaryService->getAllDictionaries(ObjectType::BLOCKS);
            
            return view('admin.blocks.index', [
                'items' => $result->items,
                'total' => $result->total,
                'pagination' => $result->pagination,
                'filters' => $filters,
                'dictionaries' => $dictionaries,
            ]);
            
        } catch (\Exception $e) {
            return view('admin.blocks.index', [
                'items' => [],
                'total' => 0,
                'pagination' => [],
                'filters' => $filters,
                'dictionaries' => [],
                'error' => 'Ошибка загрузки данных: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Детальная страница ЖК
     */
    public function show(Request $request, string $id)
    {
        try {
            $result = $this->detailService->getDetail(
                objectType: ObjectType::BLOCKS,
                identifier: $id,
                useSlug: false,
                useAggregation: true
            );
            
            return view('admin.blocks.show', [
                'block' => $result->entity,
                'media' => $result->media,
                'related' => $result->related,
                'meta' => [
                    'is_complete' => $result->isComplete(),
                    'failed_endpoints' => $result->failedEndpoints,
                ]
            ]);
            
        } catch (NotFoundError $e) {
            return redirect()
                ->route('admin.blocks.index')
                ->with('error', 'ЖК не найден');
                
        } catch (\Exception $e) {
            return redirect()
                ->route('admin.blocks.index')
                ->with('error', 'Ошибка загрузки данных: ' . $e->getMessage());
        }
    }
}
