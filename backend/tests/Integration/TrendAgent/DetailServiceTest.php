<?php

namespace Tests\Integration\TrendAgent;

use App\Services\TrendAgent\Detail\{DetailService, DetailAggregator, SlugResolver};
use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Core\Contracts\DetailResult;
use App\Services\TrendAgent\Core\Errors\{NotFoundError, PartialAggregationError};
use App\Services\TrendAgent\Entities\{BlockEntity, ApartmentEntity, EntityNormalizer};
use App\Services\TrendAgent\Http\{HttpClient, RetryManager, ResponseNormalizer};
use App\Services\TrendAgent\Router\{EndpointBuilder, ObjectTypeResolver};
use Illuminate\Http\Client\Response;
use Mockery;
use PHPUnit\Framework\TestCase;

/**
 * Integration тесты для DetailService
 * 
 * Проверяют:
 * - Возвращает Entity вместо массива
 * - Корректно обрабатывает partial failures
 * - Правильная интеграция всех компонентов
 * - НЕТ реальных HTTP запросов
 */
class DetailServiceTest extends TestCase
{
    private DetailService $service;
    private HttpClient $httpClient;
    private EntityNormalizer $entityNormalizer;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock components
        $this->httpClient = Mockery::mock(HttpClient::class);
        
        // Real components
        $this->entityNormalizer = new EntityNormalizer();
        $resolver = new ObjectTypeResolver();
        $authManager = Mockery::mock(\App\Services\TrendAgent\Auth\AuthTokenManager::class);
        $authManager->shouldReceive('getValidToken')->andReturn('mock-token');
        
        $endpointBuilder = new EndpointBuilder($authManager);
        $retryManager = new RetryManager();
        $responseNormalizer = new ResponseNormalizer();
        
        $aggregator = Mockery::mock(DetailAggregator::class);
        $slugResolver = Mockery::mock(SlugResolver::class);

        $this->service = new DetailService(
            $resolver,
            $endpointBuilder,
            $this->httpClient,
            $retryManager,
            $responseNormalizer,
            $aggregator,
            $slugResolver,
            $this->entityNormalizer
        );
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_returns_entity_not_raw_array(): void
    {
        // Arrange: Mock HTTP response for simple detail (not BLOCKS)
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([
            '_id' => '456',
            'rooms' => 2,
            'area' => 65.5,
            'price' => 8000000,
            'floor' => 5
        ]);
        $mockResponse->shouldReceive('successful')->andReturn(true);
        $mockResponse->shouldReceive('status')->andReturn(200);

        $this->httpClient->shouldReceive('get')
            ->once()
            ->andReturn($mockResponse);

        // Act
        $result = $this->service->getDetail(
            ObjectType::APARTMENTS,
            id: '456',
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $this->assertInstanceOf(DetailResult::class, $result);
        
        // Ключевая проверка: entity должна быть Entity, не array
        $this->assertInstanceOf(ApartmentEntity::class, $result->entity);
        $this->assertEquals('456', $result->entity->id);
        $this->assertEquals(2, $result->entity->rooms);
    }

    public function test_throws_not_found_error_for_404(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('status')->andReturn(404);
        $mockResponse->shouldReceive('successful')->andReturn(false);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Assert
        $this->expectException(NotFoundError::class);

        // Act
        $this->service->getDetail(
            ObjectType::APARTMENTS,
            id: 'non-existent',
            city: '58c665588b6aa52311afa01b'
        );
    }

    public function test_detail_result_has_media_collection(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([
            '_id' => '456',
            'rooms' => 2,
            'area' => 65.5,
            'price' => 8000000,
            'floor' => 5,
            'media' => [
                'photos' => ['photo1.jpg', 'photo2.jpg']
            ]
        ]);
        $mockResponse->shouldReceive('successful')->andReturn(true);
        $mockResponse->shouldReceive('status')->andReturn(200);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Act
        $result = $this->service->getDetail(
            ObjectType::APARTMENTS,
            id: '456',
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $this->assertInstanceOf(\App\Services\TrendAgent\Core\Contracts\MediaCollection::class, $result->media);
    }

    public function test_is_complete_returns_true_when_all_loaded(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([
            '_id' => '456',
            'rooms' => 2,
            'area' => 65.5,
            'price' => 8000000,
            'floor' => 5
        ]);
        $mockResponse->shouldReceive('successful')->andReturn(true);
        $mockResponse->shouldReceive('status')->andReturn(200);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Act
        $result = $this->service->getDetail(
            ObjectType::APARTMENTS,
            id: '456',
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $this->assertTrue($result->isComplete());
        $this->assertEmpty($result->getFailedEndpoints());
    }

    public function test_meta_contains_object_type_and_id(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([
            '_id' => '456',
            'rooms' => 2,
            'area' => 65.5,
            'price' => 8000000,
            'floor' => 5
        ]);
        $mockResponse->shouldReceive('successful')->andReturn(true);
        $mockResponse->shouldReceive('status')->andReturn(200);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Act
        $result = $this->service->getDetail(
            ObjectType::APARTMENTS,
            id: '456',
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $this->assertArrayHasKey('objectType', $result->meta);
        $this->assertArrayHasKey('id', $result->meta);
        $this->assertArrayHasKey('city', $result->meta);
        $this->assertEquals('apartments', $result->meta['objectType']);
        $this->assertEquals('456', $result->meta['id']);
    }

    public function test_handles_different_object_types(): void
    {
        // Test with PARKING
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([
            '_id' => '789',
            'type' => 'underground',
            'area' => 15,
            'price' => 1500000
        ]);
        $mockResponse->shouldReceive('successful')->andReturn(true);
        $mockResponse->shouldReceive('status')->andReturn(200);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        $result = $this->service->getDetail(
            ObjectType::PARKING,
            id: '789',
            city: '58c665588b6aa52311afa01b'
        );

        $this->assertInstanceOf(\App\Services\TrendAgent\Entities\ParkingEntity::class, $result->entity);
        $this->assertEquals('789', $result->entity->id);
    }

    public function test_entity_preserves_raw_data(): void
    {
        // Arrange
        $mockResponse = Mockery::mock(Response::class);
        $mockResponse->shouldReceive('json')->andReturn([
            '_id' => '456',
            'rooms' => 2,
            'area' => 65.5,
            'price' => 8000000,
            'floor' => 5,
            'custom_field' => 'custom_value'
        ]);
        $mockResponse->shouldReceive('successful')->andReturn(true);
        $mockResponse->shouldReceive('status')->andReturn(200);

        $this->httpClient->shouldReceive('get')->andReturn($mockResponse);

        // Act
        $result = $this->service->getDetail(
            ObjectType::APARTMENTS,
            id: '456',
            city: '58c665588b6aa52311afa01b'
        );

        // Assert
        $rawData = $result->entity->getRawData();
        $this->assertArrayHasKey('custom_field', $rawData);
        $this->assertEquals('custom_value', $rawData['custom_field']);
    }
}
