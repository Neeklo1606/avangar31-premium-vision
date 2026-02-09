<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Core\ObjectType;
use Illuminate\Http\Request;

/**
 * Admin Dashboard Controller
 * 
 * Главная страница админ-панели TrendAgent
 */
class DashboardController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService
    ) {}

    /**
     * Dashboard главная страница
     */
    public function index(Request $request)
    {
        $cityId = $request->input('city', config('trendagent.default_city'));
        
        try {
            // Получаем статистику по всем типам объектов
            $stats = [
                'blocks' => $this->catalogService->getCount(ObjectType::BLOCKS, ['city' => $cityId]),
                'apartments' => $this->catalogService->getCount(ObjectType::APARTMENTS, ['city' => $cityId]),
                'parking' => $this->catalogService->getCount(ObjectType::PARKING, ['city' => $cityId]),
                'houses' => $this->catalogService->getCount(ObjectType::HOUSES, ['city' => $cityId]),
                'plots' => $this->catalogService->getCount(ObjectType::PLOTS, ['city' => $cityId]),
                'commerce' => $this->catalogService->getCount(ObjectType::COMMERCE, ['city' => $cityId]),
                'villages' => $this->catalogService->getCount(ObjectType::VILLAGES, ['city' => $cityId]),
                'house_projects' => $this->catalogService->getCount(ObjectType::HOUSE_PROJECTS, ['city' => $cityId]),
            ];
            
            return view('admin.dashboard', compact('stats'));
            
        } catch (\Exception $e) {
            return view('admin.dashboard', [
                'stats' => [],
                'error' => 'Ошибка загрузки данных: ' . $e->getMessage()
            ]);
        }
    }
}
