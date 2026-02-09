<?php

namespace App\Services\TrendAgent\Media;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Contracts\MediaCollection;
use App\Services\TrendAgent\Router\EndpointBuilder;
use App\Services\TrendAgent\Http\HttpClient;
use App\Services\TrendAgent\Http\RetryManager;
use App\Services\TrendAgent\Http\ResponseNormalizer;
use App\Services\TrendAgent\Core\Contracts\ApiEndpoint;

/**
 * Унифицированный сервис для работы с медиа
 * 
 * Ответственность:
 * - Получение медиа для объектов
 * - Нормализация URL'ов
 * - Группировка медиа по типам
 * 
 * Типы медиа:
 * - Фото (планы, ход строительства, отделка)
 * - Видео
 * - Документы
 * - 3D-туры
 * - Поэтажные планы
 */
class MediaService
{
    public function __construct(
        private readonly EndpointBuilder $endpointBuilder,
        private readonly HttpClient $httpClient,
        private readonly RetryManager $retryManager,
        private readonly ResponseNormalizer $normalizer
    ) {}

    /**
     * Получить все медиа для блока (ЖК)
     * 
     * Endpoint'ы:
     * - /v4_29/media/block/{id}/plans/
     * - /v4_29/media/block/{id}/progress/years/
     * - /v4_29/media/block/{id}/progress/{year}/
     * - https://video.trendagent.ru/videos/block/{id}
     * - https://files.trendagent.ru/fs/list/block/{id}
     */
    public function getBlockMedia(string $blockId, string $city): MediaCollection
    {
        $photos = [];
        $videos = [];
        $documents = [];
        $floorPlans = [];

        // Получить планы
        $plans = $this->fetchMedia(
            new ApiEndpoint(
                domain: 'api.trendagent.ru',
                version: 'v4_29',
                path: '/media/block/{id}/plans/',
                pathParams: ['id']
            ),
            ['id' => $blockId],
            $city
        );
        $photos = array_merge($photos, $plans);

        // Получить года прогресса
        $years = $this->fetchMedia(
            new ApiEndpoint(
                domain: 'api.trendagent.ru',
                version: 'v4_29',
                path: '/media/block/{id}/progress/years/',
                pathParams: ['id']
            ),
            ['id' => $blockId],
            $city
        );

        // Получить фото прогресса для каждого года
        foreach ($years as $year) {
            $progressPhotos = $this->fetchMedia(
                new ApiEndpoint(
                    domain: 'api.trendagent.ru',
                    version: 'v4_29',
                    path: '/media/block/{id}/progress/{year}/',
                    pathParams: ['id', 'year']
                ),
                ['id' => $blockId, 'year' => $year],
                $city
            );
            $floorPlans = array_merge($floorPlans, $progressPhotos);
        }

        // Получить видео
        $videos = $this->fetchMedia(
            new ApiEndpoint(
                domain: 'video.trendagent.ru',
                version: null,
                path: '/videos/block/{id}',
                pathParams: ['id']
            ),
            ['id' => $blockId],
            $city
        );

        // Получить документы
        $documents = $this->fetchMedia(
            new ApiEndpoint(
                domain: 'files.trendagent.ru',
                version: null,
                path: '/fs/list/block/{id}',
                pathParams: ['id']
            ),
            ['id' => $blockId],
            $city
        );

        return new MediaCollection(
            photos: $photos,
            videos: $videos,
            documents: $documents,
            floorPlans: $floorPlans
        );
    }

    /**
     * Получить медиа для квартиры
     */
    public function getApartmentMedia(string $apartmentId, string $city): MediaCollection
    {
        // Квартиры обычно имеют медиа в самом объекте
        // Но можно расширить при необходимости
        return new MediaCollection();
    }

    /**
     * Выполнить запрос медиа
     */
    private function fetchMedia(
        ApiEndpoint $endpoint,
        array $pathParams,
        string $city
    ): array {
        try {
            $url = $this->endpointBuilder->build(
                $endpoint,
                $pathParams,
                [],
                $city
            );

            $response = $this->retryManager->retry(
                fn() => $this->httpClient->get($url)
            );

            $data = $this->normalizer->normalize($response);

            // Извлечь массив медиа (может быть в data или сразу массив)
            return $data['data'] ?? $data['items'] ?? $data;

        } catch (\Exception $e) {
            // Если медиа не найдено — вернуть пустой массив
            return [];
        }
    }

    /**
     * Нормализовать URL медиа
     * 
     * Убедиться что URL абсолютный
     */
    public function normalizeUrl(string $url): string
    {
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        // Если относительный — добавить базовый домен
        return 'https://api.trendagent.ru' . $url;
    }

    /**
     * Группировать медиа по типу
     */
    public function groupByType(array $mediaItems): array
    {
        $grouped = [
            'photos' => [],
            'videos' => [],
            'documents' => [],
            'tours3D' => [],
            'floorPlans' => [],
            'other' => [],
        ];

        foreach ($mediaItems as $item) {
            $type = $item['type'] ?? $this->detectType($item);

            if (isset($grouped[$type])) {
                $grouped[$type][] = $item;
            } else {
                $grouped['other'][] = $item;
            }
        }

        return $grouped;
    }

    /**
     * Определить тип медиа по данным
     */
    private function detectType(array $item): string
    {
        $url = $item['url'] ?? $item['file'] ?? '';
        
        if (str_contains($url, 'video') || str_ends_with($url, '.mp4')) {
            return 'videos';
        }

        if (str_contains($url, 'doc') || str_ends_with($url, '.pdf')) {
            return 'documents';
        }

        if (str_contains($url, 'plan') || str_contains($url, 'floor')) {
            return 'floorPlans';
        }

        if (str_contains($url, '3d') || str_contains($url, 'tour')) {
            return 'tours3D';
        }

        return 'photos';
    }
}
