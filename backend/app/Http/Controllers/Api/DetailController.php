<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TrendAgent\Detail\DetailService;
use App\Services\TrendAgent\Media\MediaService;
use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Errors\NotFoundError;
use App\Http\Resources\TrendAgent\DetailResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Контроллер для получения детальной информации об объектах
 * 
 * ПРИМЕР интеграции TrendAgent через Laravel DI
 */
class DetailController extends Controller
{
    public function __construct(
        private readonly DetailService $detailService,
        private readonly MediaService $mediaService
    ) {}

    /**
     * Получить детальную информацию по ID
     * 
     * GET /api/{type}/{id}
     * GET /api/{type}/{id}?with_media=true&with_aggregation=true
     * 
     * Примеры:
     * - GET /api/blocks/59fc27538bcb2468a6174402
     * - GET /api/apartments/63c5614728d3bcf2420860b1?with_media=true
     */
    public function show(Request $request, string $type, string $id): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);
            $withAggregation = $request->boolean('with_aggregation', true);
            $withMedia = $request->boolean('with_media', false);

            // Получаем детальную информацию
            $result = $this->detailService->getDetail(
                objectType: $objectType,
                identifier: $id,
                useSlug: false,
                useAggregation: $withAggregation
            );

            // Опционально добавляем медиа
            if ($withMedia && !$result->media) {
                $media = $this->mediaService->getMedia($objectType, $id);
                $result = new \App\Services\TrendAgent\Core\Contracts\DetailResult(
                    entity: $result->entity,
                    media: $media,
                    related: $result->related,
                    dictionariesUsed: $result->dictionariesUsed,
                    failedEndpoints: $result->failedEndpoints
                );
            }

            // Возвращаем через DetailResource
            return new DetailResource($result, $objectType);

        } catch (NotFoundError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Not found',
                'message' => $e->getMessage(),
            ], 404);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Detail fetch failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Получить детальную информацию по slug (человекочитаемому URL)
     * 
     * GET /api/{type}/by-slug/{slug}
     * 
     * Примеры:
     * - GET /api/blocks/by-slug/villa-marina
     * - GET /api/apartments/by-slug/dom-na-naberezhnoy-st
     */
    public function showBySlug(Request $request, string $type, string $slug): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);
            $withAggregation = $request->boolean('with_aggregation', true);

            // Получаем по slug
            $result = $this->detailService->getDetail(
                objectType: $objectType,
                identifier: $slug,
                useSlug: true,
                useAggregation: $withAggregation
            );

            // Возвращаем через DetailResource
            return new DetailResource($result, $objectType);

        } catch (NotFoundError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Not found by slug',
                'message' => "Object with slug '{$slug}' not found",
            ], 404);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Detail fetch failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Получить только медиа для объекта
     * 
     * GET /api/{type}/{id}/media
     * 
     * Примеры:
     * - GET /api/blocks/59fc27538bcb2468a6174402/media
     */
    public function media(string $type, string $id): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);

            $media = $this->mediaService->getMedia($objectType, $id);

            return response()->json([
                'success' => true,
                'data' => [
                    'photos' => $media->photos,
                    'videos' => $media->videos,
                    'documents' => $media->documents,
                    'plans' => $media->plans,
                    'progress' => $media->progress,
                    'has_content' => $media->hasContent(),
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
                'error' => 'Media fetch failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Batch получение детальной информации по нескольким ID
     * 
     * POST /api/{type}/batch
     * {
     *   "ids": ["id1", "id2", "id3"],
     *   "with_aggregation": true
     * }
     */
    public function batch(Request $request, string $type): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'string',
            'with_aggregation' => 'boolean',
        ]);

        try {
            $objectType = ObjectType::from($type);
            $ids = $request->input('ids');
            $withAggregation = $request->boolean('with_aggregation', true);

            $results = [];

            foreach ($ids as $id) {
                try {
                    $result = $this->detailService->getDetail(
                        objectType: $objectType,
                        identifier: $id,
                        useSlug: false,
                        useAggregation: $withAggregation
                    );

                    $results[$id] = [
                        'success' => true,
                        'entity' => $result->entity,
                        'related' => $result->related,
                        'is_complete' => $result->isComplete(),
                    ];

                } catch (NotFoundError $e) {
                    $results[$id] = [
                        'success' => false,
                        'error' => 'Not found',
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => $results,
            ]);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Batch fetch failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
