<?php

namespace App\Services\TrendAgent\Catalog;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Contracts\CatalogResult;
use App\Services\TrendAgent\Core\Contracts\FilterSet;
use App\Services\TrendAgent\Router\ObjectTypeResolver;
use App\Services\TrendAgent\Router\EndpointBuilder;
use App\Services\TrendAgent\Http\HttpClient;
use App\Services\TrendAgent\Http\RetryManager;
use App\Services\TrendAgent\Http\ResponseNormalizer;
use App\Services\TrendAgent\Filters\FilterBuilder;
use App\Services\TrendAgent\Entities\EntityNormalizer;

/**
 * Унифицированный сервис для получения каталогов
 * 
 * ЕДИНАЯ ТОЧКА ВХОДА ДЛЯ ВСЕХ СПИСКОВ:
 * - Блоки (ЖК)
 * - Квартиры
 * - Паркинги
 * - Дома
 * - Участки
 * - Коммерция
 * - Проекты домов
 * - Поселки
 * 
 * Ответственность:
 * - Построение запросов с фильтрами
 * - Пагинация
 * - Сортировка
 * - Возврат CatalogResult<T>
 */
class CatalogService
{
    public function __construct(
        private readonly ObjectTypeResolver $resolver,
        private readonly EndpointBuilder $endpointBuilder,
        private readonly FilterBuilder $filterBuilder,
        private readonly HttpClient $httpClient,
        private readonly RetryManager $retryManager,
        private readonly ResponseNormalizer $normalizer,
        private readonly PaginationManager $paginationManager,
        private readonly EntityNormalizer $entityNormalizer
    ) {}

    /**
     * Получить список объектов
     * 
     * @param ObjectType $objectType Тип объекта
     * @param string $city ID города
     * @param FilterSet|null $filters Фильтры
     * @param int $page Номер страницы
     * @param int|null $pageSize Размер страницы
     * @param string|null $sort Сортировка
     * @param string|null $sortOrder Порядок сортировки (asc/desc)
     * @return CatalogResult
     */
    public function getCatalog(
        ObjectType $objectType,
        string $city,
        ?FilterSet $filters = null,
        int $page = 1,
        ?int $pageSize = null,
        ?string $sort = 'price',
        ?string $sortOrder = 'asc'
    ): CatalogResult {
        // Получить endpoint конфигурацию
        $endpoint = $this->resolver->getCatalogEndpoint($objectType);

        // Построить query параметры
        $queryParams = $this->buildQueryParams(
            $objectType,
            $filters,
            $page,
            $pageSize,
            $sort,
            $sortOrder
        );

        // Построить URL
        $url = $this->endpointBuilder->build(
            $endpoint,
            [],
            $queryParams,
            $city
        );

        // Выполнить запрос с retry
        $response = $this->retryManager->retry(
            fn() => $this->httpClient->get($url)
        );

        // Нормализовать ответ
        $normalized = $this->normalizer->normalizeCatalogResponse($response);

        // Преобразовать items в Entity
        $items = $this->entityNormalizer->normalizeMany($objectType, $normalized['items']);

        // Создать pagination metadata
        $paginationParams = $this->paginationManager->createParams($page, $pageSize);
        $pagination = $this->paginationManager->createMetadata(
            $normalized['total'],
            $paginationParams['offset'],
            $paginationParams['count']
        );

        // Вернуть CatalogResult
        return new CatalogResult(
            items: $items, // Now AbstractEntity[]
            total: $normalized['total'],
            pagination: $pagination,
            appliedFilters: $filters?->all() ?? [],
            meta: [
                'objectType' => $objectType->value,
                'city' => $city,
                'sort' => $sort,
                'sortOrder' => $sortOrder,
                'url' => $url,
            ]
        );
    }

    /**
     * Получить количество объектов без загрузки данных
     * 
     * Используется для быстрого получения count с фильтрами
     */
    public function getCount(
        ObjectType $objectType,
        string $city,
        ?FilterSet $filters = null
    ): int {
        // Получаем первую страницу с минимальным count
        $result = $this->getCatalog(
            $objectType,
            $city,
            $filters,
            page: 1,
            pageSize: 1
        );

        return $result->total;
    }

    /**
     * Построить query параметры
     */
    private function buildQueryParams(
        ObjectType $objectType,
        ?FilterSet $filters,
        int $page,
        ?int $pageSize,
        ?string $sort,
        ?string $sortOrder
    ): array {
        $params = [];

        // Пагинация
        $paginationParams = $this->paginationManager->createParams($page, $pageSize);
        $params = array_merge($params, $paginationParams);

        // Сортировка
        if ($sort !== null) {
            $params['sort'] = $sort;
        }

        if ($sortOrder !== null) {
            $params['sort_order'] = $sortOrder;
        }

        // Фильтры
        if ($filters !== null) {
            $filterParams = $this->filterBuilder->toQueryParams($filters);
            $params = array_merge($params, $filterParams);
        }

        // Специальные параметры для типа объекта
        $params = $this->resolver->applySpecialParams($objectType, $params);

        return $params;
    }

    /**
     * Получить все страницы (итератор)
     * 
     * ВНИМАНИЕ: может быть очень долгим для больших каталогов
     * 
     * @return \Generator<CatalogResult>
     */
    public function getAllPages(
        ObjectType $objectType,
        string $city,
        ?FilterSet $filters = null,
        ?int $pageSize = null,
        ?string $sort = 'price',
        ?string $sortOrder = 'asc'
    ): \Generator {
        $page = 1;

        do {
            $result = $this->getCatalog(
                $objectType,
                $city,
                $filters,
                $page,
                $pageSize,
                $sort,
                $sortOrder
            );

            yield $result;

            $page++;
        } while ($result->hasMore());
    }
}
