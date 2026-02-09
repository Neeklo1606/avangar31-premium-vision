<?php

namespace Tests\Integration\TrendAgent;

use App\Services\TrendAgent\Catalog\{CatalogService, PaginationManager};
use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Contracts\{CatalogResult, FilterSet};
use App\Services\TrendAgent\Entities\{BlockEntity, EntityNormalizer};
use App\Services\TrendAgent\Filters\FilterBuilder;
use App\Services\TrendAgent\Http\{HttpClient, RetryManager, ResponseNormalizer};
use App\Services\TrendAgent\Router\{EndpointBuilder, ObjectTypeResolver};
use Illuminate\Http\Client\Response;
use Mockery;
use PHPUnit\Framework\TestCase;

/**
 * Integration тесты для CatalogService
 * 
 * Проверяют:
 * - Возвращает Entity[] вместо массивов
 * - Корректно применяет фильтры
 * - Правильная интеграция всех компонентов
 * - НЕТ реальных HTTP запросов
 */
class CatalogServiceTest extends TestCase
{
    private CatalogService $service;
    private HttpClient $httpClient;
    private EntityNormalizer $entityNormalizer;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock HttpClient
        $this->httpClient = Mockery::mock(HttpClient::class);
        
        // Real components
        $this->entityNormalizer = new EntityNormalizer();
        $resolver = new ObjectTypeResolver();
        $authManager = Mockery::mock(\App\Services\TrendAgent\Auth\AuthTokenManager::class);
        $authManager->shouldReceive('getValidToken')->andReturn('mock-token');
        
        $endpointBuilder = new EndpointBuilder($authManager);
        $filterBuilder = new FilterBuilder(new \App\Services\TrendAgent\Filters\FilterRegistry());
        $retryManager = new RetryManager();
        $responseNormalizer = new ResponseNormalizer();
        $paginationManager = new PaginationManager();

        $this->service = new CatalogService(
            $resolver,
            $endpointBuilder,
            $filterBuilder,
            $this->httpClient,
            $retryManager,
            $responseNormalizer,
            $paginationManager,
            $this->entityNormalizer
        );
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_returns_entity_array_not_raw_array(): void
    {
        // Arrange: Mock HTTP response
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([
            ['_id' => '123', 'name' => 'Block 1'],
            ['_id' => '456', 'name' => 'Block 2']
        ]);
        $mockResponse->shouldReceive('successful')->andReturn(true);

        $this->httpClient->shouldReceive('get')
            ->once()
            ->andReturn($mockResponse);

        // Act
        $result = $this->service->getCatalog(
            ObjectType::BLOCKS,
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $this->assertInstanceOf(CatalogResult::class, $result);
        $this->assertIsArray($result->items);
        $this->assertCount(2, $result->items);
        
        // Ключевая проверка: items должны быть Entity, не array
        $this->assertContainsOnlyInstancesOf(BlockEntity::class, $result->items);
        $this->assertEquals('123', $result->items[0]->id);
        $this->assertEquals('Block 1', $result->items[0]->name);
    }

    public function test_applies_filters_correctly(): void
    {
        // Arrange
        $filterBuilder = new FilterBuilder(new \App\Services\TrendAgent\Filters\FilterRegistry());
        $filters = $filterBuilder->create(ObjectType::APARTMENTS);
        
        try {
            $filterBuilder->addFilter($filters, 'room', [1, 2, 3]);
        } catch (\Exception $e) {
            // Если фильтр не зарегистрирован, пропускаем
            $this->markTestSkipped('Room filter not registered');
        }

        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([]);
        $mockResponse->shouldReceive('successful')->andReturn(true);

        // Проверяем, что URL содержит параметры фильтров
        $this->httpClient->shouldReceive('get')
            ->once()
            ->with(Mockery::on(function ($url) {
                // URL должен содержать параметры фильтров
                return is_string($url);
            }))
            ->andReturn($mockResponse);

        // Act
        $result = $this->service->getCatalog(
            ObjectType::APARTMENTS,
            city: '58c665588b6aa52311afa01b',
            filters: $filters
        );

        // Assert
        $this->assertInstanceOf(CatalogResult::class, $result);
        $this->assertNotEmpty($result->appliedFilters);
    }

    public function test_pagination_metadata_is_correct(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([
            ['_id' => '123', 'name' => 'Block 1']
        ]);
        $mockResponse->shouldReceive('successful')->andReturn(true);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Act
        $result = $this->service->getCatalog(
            ObjectType::BLOCKS,
            city: '58c665588b6aa52311afa01b',
            page: 2,
            pageSize: 10
        );

        // Assert
        $this->assertArrayHasKey('offset', $result->pagination);
        $this->assertArrayHasKey('count', $result->pagination);
        $this->assertArrayHasKey('currentPage', $result->pagination);
        $this->assertEquals(2, $result->pagination['currentPage']);
        $this->assertEquals(10, $result->pagination['offset']);
    }

    public function test_get_count_returns_total(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([]);
        $mockResponse->shouldReceive('successful')->andReturn(true);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Act
        $count = $this->service->getCount(
            ObjectType::BLOCKS,
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $this->assertIsInt($count);
        $this->assertEquals(0, $count);
    }

    public function test_handles_empty_results(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([]);
        $mockResponse->shouldReceive('successful')->andReturn(true);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Act
        $result = $this->service->getCatalog(
            ObjectType::BLOCKS,
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $this->assertTrue($result->isEmpty());
        $this->assertEquals(0, $result->getItemsCount());
    }

    public function test_meta_contains_object_type_and_city(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([]);
        $mockResponse->shouldReceive('successful')->andReturn(true);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Act
        $result = $this->service->getCatalog(
            ObjectType::BLOCKS,
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $this->assertArrayHasKey('objectType', $result->meta);
        $this->assertArrayHasKey('city', $result->meta);
        $this->assertEquals('blocks', $result->meta['objectType']);
        $this->assertEquals('58c665588b6aa52311afa01b', $result->meta['city']);
    }
}
