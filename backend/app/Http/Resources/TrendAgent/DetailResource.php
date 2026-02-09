<?php

namespace App\Http\Resources\TrendAgent;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\TrendAgent\Core\Contracts\DetailResult;
use App\Services\TrendAgent\Core\ObjectType;

/**
 * Resource для детальной страницы
 * 
 * Унифицированная структура ответа для детальной информации
 * 
 * Формат:
 * {
 *   "data": {...},
 *   "media": {
 *     "photos": [],
 *     "videos": [],
 *     "plans": []
 *   },
 *   "related": {...},
 *   "meta": {
 *     "object_type": "blocks",
 *     "id": "123",
 *     "is_complete": true
 *   }
 * }
 */
class DetailResource extends JsonResource
{
    /**
     * @var DetailResult
     */
    public $resource;

    /**
     * @var ObjectType
     */
    private ObjectType $objectType;

    /**
     * Create a new resource instance
     */
    public function __construct(DetailResult $detailResult, ObjectType $objectType)
    {
        parent::__construct($detailResult);
        $this->objectType = $objectType;
    }

    /**
     * Transform the resource into an array
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $detail = $this->resource;

        return [
            'data' => $this->transformEntity($detail->entity),
            'media' => $this->transformMedia($detail->media),
            'related' => $detail->related,
            'meta' => [
                'object_type' => $this->objectType->value,
                'id' => $detail->entity->id,
                'is_complete' => $detail->isComplete(),
                'failed_endpoints' => $detail->failedEndpoints,
                'dictionaries_used' => $detail->dictionariesUsed,
            ],
        ];
    }

    /**
     * Преобразовать Entity в соответствующий Resource
     */
    private function transformEntity($entity): array
    {
        $resourceClass = match($this->objectType) {
            ObjectType::BLOCKS => BlockResource::class,
            ObjectType::APARTMENTS => ApartmentResource::class,
            ObjectType::PARKING => ParkingResource::class,
            ObjectType::HOUSES => HouseResource::class,
            ObjectType::PLOTS => PlotResource::class,
            ObjectType::COMMERCE => CommerceResource::class,
            ObjectType::HOUSE_PROJECTS => HouseProjectResource::class,
            ObjectType::VILLAGES => VillageResource::class,
        };

        return (new $resourceClass($entity))->resolve();
    }

    /**
     * Преобразовать MediaCollection
     */
    private function transformMedia($media): array
    {
        if (!$media) {
            return [
                'photos' => [],
                'videos' => [],
                'documents' => [],
                'plans' => [],
                'progress' => [],
            ];
        }

        return [
            'photos' => $media->photos ?? [],
            'videos' => $media->videos ?? [],
            'documents' => $media->documents ?? [],
            'plans' => $media->plans ?? [],
            'progress' => $media->progress ?? [],
            'has_content' => $media->hasContent(),
        ];
    }
}
