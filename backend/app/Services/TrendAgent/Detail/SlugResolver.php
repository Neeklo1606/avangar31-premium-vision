<?php

namespace App\Services\TrendAgent\Detail;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Errors\NotFoundError;
use App\Services\TrendAgent\Dictionaries\CacheManager;
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Core\Contracts\FilterSet;

/**
 * Резолвер slug → ID
 * 
 * Ответственность:
 * - Конвертация slug в _id для API запросов
 * - Кэширование маппингов
 * - Поиск по каталогу если не найдено в кэше
 * 
 * Используется для:
 * - Детальных страниц (/object/villa-marina/)
 * - Где URL содержит slug, а API требует _id
 */
class SlugResolver
{
    public function __construct(
        private readonly CatalogService $catalogService,
        private readonly CacheManager $cacheManager
    ) {}

    /**
     * Получить ID по slug
     * 
     * @param ObjectType $objectType Тип объекта
     * @param string $slug Slug объекта
     * @param string $city ID города
     * @return string ID объекта
     * @throws NotFoundError если объект не найден
     */
    public function resolve(ObjectType $objectType, string $slug, string $city): string
    {
        // Попытка получить из кэша
        $cached = $this->cacheManager->rememberSlugMap(
            $objectType->value,
            $slug,
            fn() => $this->searchInCatalog($objectType, $slug, $city)
        );

        if ($cached === null) {
            throw new NotFoundError(
                "Object not found for slug: {$slug}",
                context: ['objectType' => $objectType->value, 'slug' => $slug, 'city' => $city]
            );
        }

        return $cached;
    }

    /**
     * Поиск ID в каталоге
     * 
     * Стратегия:
     * 1. Получить первую страницу каталога
     * 2. Найти объект с нужным slug
     * 3. Вернуть его _id
     */
    private function searchInCatalog(ObjectType $objectType, string $slug, string $city): ?string
    {
        // Для блоков используем специальный подход
        if ($objectType === ObjectType::BLOCKS) {
            return $this->searchBlockByGuid($slug, $city);
        }

        // Для других типов — поиск в каталоге
        // Получаем достаточно большую страницу, чтобы найти объект
        $result = $this->catalogService->getCatalog(
            $objectType,
            $city,
            pageSize: 100
        );

        foreach ($result->items as $item) {
            $itemSlug = $item['slug'] ?? $item['guid'] ?? null;
            
            if ($itemSlug === $slug) {
                return $item['_id'] ?? $item['id'] ?? null;
            }
        }

        // Если не найдено на первой странице — можно расширить поиск
        // Но это будет медленно для больших каталогов
        // Альтернатива: использовать API поиск если есть

        return null;
    }

    /**
     * Специальный поиск для блоков (ЖК)
     * 
     * Блоки используют guid вместо slug
     */
    private function searchBlockByGuid(string $guid, string $city): ?string
    {
        // Для блоков можно использовать map endpoint
        // Или поиск в каталоге
        
        $result = $this->catalogService->getCatalog(
            ObjectType::BLOCKS,
            $city,
            pageSize: 100
        );

        foreach ($result->items as $item) {
            if (($item['guid'] ?? null) === $guid) {
                return $item['_id'] ?? null;
            }
        }

        return null;
    }

    /**
     * Предзагрузить маппинги для списка slug'ов
     * 
     * Оптимизация: загрузить все объекты сразу
     */
    public function preload(ObjectType $objectType, array $slugs, string $city): array
    {
        $mappings = [];

        foreach ($slugs as $slug) {
            try {
                $id = $this->resolve($objectType, $slug, $city);
                $mappings[$slug] = $id;
            } catch (NotFoundError $e) {
                // Пропускаем не найденные
                continue;
            }
        }

        return $mappings;
    }
}
