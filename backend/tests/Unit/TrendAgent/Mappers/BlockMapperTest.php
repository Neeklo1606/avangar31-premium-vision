<?php

namespace Tests\Unit\TrendAgent\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\BlockEntity;
use App\Services\TrendAgent\Entities\Mappers\BlockMapper;
use PHPUnit\Framework\TestCase;

/**
 * Unit тесты для BlockMapper
 * 
 * Проверяют:
 * - Поддержку правильного ObjectType
 * - Валидацию данных
 * - Создание BlockEntity
 */
class BlockMapperTest extends TestCase
{
    private BlockMapper $mapper;

    protected function setUp(): void
    {
        $this->mapper = new BlockMapper();
    }

    public function test_supports_blocks_object_type(): void
    {
        $this->assertTrue($this->mapper->supports(ObjectType::BLOCKS));
    }

    public function test_does_not_support_other_object_types(): void
    {
        $this->assertFalse($this->mapper->supports(ObjectType::APARTMENTS));
        $this->assertFalse($this->mapper->supports(ObjectType::PARKING));
    }

    public function test_get_object_type_returns_blocks(): void
    {
        $this->assertEquals(ObjectType::BLOCKS, $this->mapper->getObjectType());
    }

    public function test_maps_data_to_block_entity(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Villa Marina'
        ];

        $entity = $this->mapper->map($data);

        $this->assertInstanceOf(BlockEntity::class, $entity);
        $this->assertEquals('123', $entity->id);
        $this->assertEquals('Villa Marina', $entity->name);
    }

    public function test_throws_exception_when_data_empty(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Data cannot be empty');

        $this->mapper->map([]);
    }

    public function test_throws_exception_when_id_missing(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('ID is required');

        $this->mapper->map(['name' => 'Test']);
    }

    public function test_maps_complex_data(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Villa Marina',
            'price_from' => 5000000,
            'area_from' => 40,
            'lat' => 59.9,
            'lng' => 30.3
        ];

        $entity = $this->mapper->map($data);

        $this->assertInstanceOf(BlockEntity::class, $entity);
        $this->assertNotNull($entity->priceFrom);
        $this->assertNotNull($entity->areaFrom);
        $this->assertNotNull($entity->location);
    }
}
