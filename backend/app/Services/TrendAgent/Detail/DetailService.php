<?php

namespace App\Services\TrendAgent\Detail;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Contracts\DetailResult;
use App\Services\TrendAgent\Core\Contracts\MediaCollection;
use App\Services\TrendAgent\Core\Errors\NotFoundError;
use App\Services\TrendAgent\Core\Errors\PartialAggregationError;
use App\Services\TrendAgent\Router\ObjectTypeResolver;
use App\Services\TrendAgent\Router\EndpointBuilder;
use App\Services\TrendAgent\Http\HttpClient;
use App\Services\TrendAgent\Http\RetryManager;
use App\Services\TrendAgent\Http\ResponseNormalizer;
use App\Services\TrendAgent\Entities\EntityNormalizer;

/**
 * Унифицированный сервис для получения детальной информации
 * 
 * ЕДИНАЯ ТОЧКА ВХОДА ДЛЯ ВСЕХ ДЕТАЛЕЙ:
 * - Блоки (ЖК) — агрегация 22 endpoint'ов
 * - Квартиры
 * - Паркинги
 * - Дома
 * - Участки
 * - Коммерция
 * - Проекты домов
 * 
 * Ответственность:
 * - Получение детальной информации по ID
 * - Агрегация данных из множественных источников
 * - Обработка slug → ID конвертации
 * - Возврат DetailResult<T>
 */
class DetailService
{
    public function __construct(
        private readonly ObjectTypeResolver $resolver,
        private readonly EndpointBuilder $endpointBuilder,
        private readonly HttpClient $httpClient,
        private readonly RetryManager $retryManager,
        private readonly ResponseNormalizer $normalizer,
        private readonly DetailAggregator $aggregator,
        private readonly SlugResolver $slugResolver,
        private readonly EntityNormalizer $entityNormalizer
    ) {}

    /**
     * Получить детальную информацию по ID
     * 
     * @param ObjectType $objectType Тип объекта
     * @param string $id ID объекта
     * @param string $city ID города
     * @return DetailResult
     * @throws NotFoundError если объект не найден
     */
    public function getDetail(
        ObjectType $objectType,
        string $id,
        string $city
    ): DetailResult {
        // Для сложных типов (BLOCKS) — использовать агрегацию
        if ($this->requiresAggregation($objectType)) {
            return $this->getDetailWithAggregation($objectType, $id, $city);
        }

        // Для простых типов — один запрос
        return $this->getSimpleDetail($objectType, $id, $city);
    }

    /**
     * Получить детальную информацию по slug
     * 
     * @throws NotFoundError если объект не найден
     */
    public function getDetailBySlug(
        ObjectType $objectType,
        string $slug,
        string $city
    ): DetailResult {
        // Конвертировать slug → ID
        $id = $this->slugResolver->resolve($objectType, $slug, $city);

        // Получить детали
        return $this->getDetail($objectType, $id, $city);
    }

    /**
     * Проверить, требуется ли агрегация для типа объекта
     */
    private function requiresAggregation(ObjectType $objectType): bool
    {
        return match($objectType) {
            ObjectType::BLOCKS => true,
            default => false,
        };
    }

    /**
     * Получить детали с агрегацией (для сложных типов)
     */
    private function getDetailWithAggregation(
        ObjectType $objectType,
        string $id,
        string $city
    ): DetailResult {
        try {
            // Агрегировать данные
            $aggregated = $this->aggregator->aggregate($objectType, $id, $city);

            // Преобразовать в Entity
            $entity = $this->entityNormalizer->normalize($objectType, $aggregated['entity'] ?? []);

            // Создать MediaCollection
            $media = $this->createMediaCollection($aggregated['media'] ?? []);

            // Вернуть DetailResult
            return new DetailResult(
                entity: $entity, // Now AbstractEntity
                media: $media,
                related: $aggregated['related'] ?? [],
                dictionariesUsed: [],
                meta: [
                    'objectType' => $objectType->value,
                    'id' => $id,
                    'city' => $city,
                    'aggregated' => true,
                ]
            );

        } catch (PartialAggregationError $e) {
            // Частичная ошибка — вернуть доступные данные
            $aggregated = $e->getSuccessfulResponses();
            
            // Преобразовать в Entity
            $entity = $this->entityNormalizer->normalize($objectType, $aggregated['entity'] ?? []);
            
            $media = $this->createMediaCollection($aggregated['media'] ?? []);

            return new DetailResult(
                entity: $entity, // Now AbstractEntity
                media: $media,
                related: $aggregated['related'] ?? [],
                dictionariesUsed: [],
                meta: [
                    'objectType' => $objectType->value,
                    'id' => $id,
                    'city' => $city,
                    'aggregated' => true,
                    'failedEndpoints' => $e->getFailedEndpoints(),
                    'partial' => true,
                ]
            );
        }
    }

    /**
     * Получить простые детали (один запрос)
     */
    private function getSimpleDetail(
        ObjectType $objectType,
        string $id,
        string $city
    ): DetailResult {
        // Получить endpoint
        $endpoint = $this->resolver->getDetailEndpoint($objectType);

        // Построить URL
        $url = $this->endpointBuilder->build(
            $endpoint,
            ['id' => $id],
            [],
            $city
        );

        // Выполнить запрос
        $response = $this->retryManager->retry(
            fn() => $this->httpClient->get($url)
        );

        // Проверить статус
        if ($response->status() === 404) {
            throw new NotFoundError(
                "Object not found: {$id}",
                context: ['objectType' => $objectType->value, 'id' => $id]
            );
        }

        // Нормализовать ответ
        $data = $this->normalizer->normalize($response);

        // Преобразовать в Entity
        $entity = $this->entityNormalizer->normalize($objectType, $data);

        // Создать MediaCollection (если есть медиа в ответе)
        $media = $this->createMediaCollection($data['media'] ?? []);

        // Вернуть DetailResult
        return new DetailResult(
            entity: $entity, // Now AbstractEntity
            media: $media,
            related: [],
            dictionariesUsed: [],
            meta: [
                'objectType' => $objectType->value,
                'id' => $id,
                'city' => $city,
                'url' => $url,
            ]
        );
    }

    /**
     * Создать MediaCollection из данных
     */
    private function createMediaCollection(array $mediaData): MediaCollection
    {
        return new MediaCollection(
            photos: $mediaData['photos'] ?? $mediaData['plans'] ?? [],
            videos: $mediaData['videos'] ?? [],
            documents: $mediaData['documents'] ?? [],
            tours3D: $mediaData['tours3D'] ?? [],
            floorPlans: $mediaData['floorPlans'] ?? $mediaData['progress'] ?? [],
            other: $mediaData['other'] ?? []
        );
    }
}
