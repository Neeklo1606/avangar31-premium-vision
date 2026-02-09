<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Services\TrendAgent\Core\Contracts\CatalogResult;
use App\Services\TrendAgent\Core\ObjectType;

/**
 * Resource Collection для каталога
 * 
 * Унифицированная структура ответа для всех типов объектов
 * 
 * Формат:
 * {
 *   "data": [...],
 *   "meta": {
 *     "total": 123,
 *     "page": 1,
 *     "per_page": 20,
 *     "object_type": "blocks",
 *     "city": "58c665588b6aa52311afa01b"
 *   },
 *   "filters": {...},
 *   "dictionaries": {...}
 * }
 */
class CatalogCollection extends ResourceCollection
{
    /**
     * @var CatalogResult
     */
    private CatalogResult $catalogResult;

    /**
     * @var ObjectType
     */
    private ObjectType $objectType;

    /**
     * @var array|null
     */
    private ?array $dictionaries;

    /**
     * Create a new resource instance
     */
    public function __construct(
        CatalogResult $catalogResult,
        ObjectType $objectType,
        ?array $dictionaries = null
    ) {
        parent::__construct($catalogResult->items);
        
        $this->catalogResult = $catalogResult;
        $this->objectType = $objectType;
        $this->dictionaries = $dictionaries;
    }

    /**
     * Transform the resource collection into an array
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->transformItems(),
            'meta' => $this->getMeta(),
            'filters' => $this->catalogResult->appliedFilters,
            'dictionaries' => $this->dictionaries,
        ];
    }

    /**
     * Преобразовать items в соответствующие Resources
     */
    private function transformItems(): array
    {
        $resourceClass = $this->getResourceClass();
        
        return array_map(
            fn($item) => (new $resourceClass($item))->resolve(),
            $this->catalogResult->items
        );
    }

    /**
     * Получить класс Resource для текущего ObjectType
     */
    private function getResourceClass(): string
    {
        return match($this->objectType) {
            ObjectType::BLOCKS => BlockResource::class,
            ObjectType::APARTMENTS => ApartmentResource::class,
            ObjectType::PARKING => ParkingResource::class,
            ObjectType::HOUSES => HouseResource::class,
            ObjectType::PLOTS => PlotResource::class,
            ObjectType::COMMERCE => CommerceResource::class,
            ObjectType::HOUSE_PROJECTS => HouseProjectResource::class,
            ObjectType::VILLAGES => VillageResource::class,
        };
    }

    /**
     * Получить метаданные
     */
    private function getMeta(): array
    {
        $pagination = $this->catalogResult->pagination;
        
        return [
            'total' => $this->catalogResult->total,
            'page' => $pagination['page'] ?? 1,
            'per_page' => $pagination['per_page'] ?? 20,
            'total_pages' => $pagination['total_pages'] ?? 1,
            'has_more' => $pagination['has_more'] ?? false,
            'object_type' => $this->objectType->value,
            'city' => config('trendagent.default_city'),
        ];
    }
}
