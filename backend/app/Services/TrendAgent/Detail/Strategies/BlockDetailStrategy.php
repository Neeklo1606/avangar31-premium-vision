<?php

namespace App\Services\TrendAgent\Detail\Strategies;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Router\EndpointBuilder;
use App\Services\TrendAgent\Core\Contracts\ApiEndpoint;

/**
 * Стратегия агрегации для BLOCKS (ЖК)
 * 
 * 22 endpoint'а:
 * 1. Unified (основная информация)
 * 2. Advantages (преимущества)
 * 3. Finishings (отделка)
 * 4. Nearby places (инфраструктура)
 * 5. Geo buildings (геометрия домов)
 * 6. Media plans (планы)
 * 7. Media progress years (года строительства)
 * 8. Media progress (фото хода строительства)
 * 9. Videos (видео)
 * 10. Documents (документы)
 * + еще до 22 endpoint'ов
 */
class BlockDetailStrategy implements DetailStrategy
{
    public function __construct(
        private readonly EndpointBuilder $endpointBuilder
    ) {}

    public function getObjectType(): ObjectType
    {
        return ObjectType::BLOCKS;
    }

    public function getEndpoints(string $id, string $city): array
    {
        $baseUrl = 'https://api.trendagent.ru/v4_29';
        
        return [
            // ОСНОВНАЯ ИНФОРМАЦИЯ
            'unified' => "{$baseUrl}/blocks/{$id}/unified/",
            'advantages' => "{$baseUrl}/blocks/{$id}/advantages/",
            'finishings' => "{$baseUrl}/finishings/block/{$id}/",
            'nearby_places' => "{$baseUrl}/blocks/{$id}/nearby_places/",
            'geo_buildings' => "{$baseUrl}/blocks/{$id}/geo/buildings/",
            
            // МЕДИА
            'media_plans' => "{$baseUrl}/media/block/{$id}/plans/",
            'media_progress_years' => "{$baseUrl}/media/block/{$id}/progress/years/",
            
            // ВНЕШНИЕ API
            'videos' => "https://video.trendagent.ru/videos/block/{$id}",
            'documents' => "https://files.trendagent.ru/fs/list/block/{$id}",
            
            // ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ
            'bank' => "{$baseUrl}/blocks/{$id}/bank/",
            'mortgage' => "{$baseUrl}/blocks/{$id}/mortgage/",
            
            // СВЯЗАННЫЕ СУЩНОСТИ
            'buildings' => "{$baseUrl}/buildings/block/{$id}/",
            'sections' => "{$baseUrl}/sections/block/{$id}/",
        ];
    }

    public function aggregate(array $responses): array
    {
        $entity = $responses['unified'] ?? [];
        
        $related = [
            'advantages' => $responses['advantages'] ?? [],
            'finishings' => $responses['finishings'] ?? [],
            'nearbyPlaces' => $responses['nearby_places'] ?? [],
            'geoBuildings' => $responses['geo_buildings'] ?? [],
            'bank' => $responses['bank'] ?? [],
            'mortgage' => $responses['mortgage'] ?? [],
            'buildings' => $responses['buildings'] ?? [],
            'sections' => $responses['sections'] ?? [],
        ];

        $media = [
            'plans' => $responses['media_plans'] ?? [],
            'progress' => $this->aggregateProgress($responses),
            'videos' => $responses['videos'] ?? [],
            'documents' => $responses['documents'] ?? [],
        ];

        return [
            'entity' => $entity,
            'related' => $related,
            'media' => $media,
        ];
    }

    /**
     * Агрегировать фото хода строительства по годам
     */
    private function aggregateProgress(array $responses): array
    {
        $years = $responses['media_progress_years'] ?? [];
        $progress = [];

        foreach ($years as $year) {
            // Для каждого года нужен отдельный запрос
            // Но это уже было выполнено в DetailAggregator
            $yearData = $responses["media_progress_{$year}"] ?? [];
            
            if (!empty($yearData)) {
                $progress[$year] = $yearData;
            }
        }

        return $progress;
    }
}
