<?php

namespace Tests\Unit\TrendAgent\Normalizer;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\{
    BlockEntity,
    ApartmentEntity,
    ParkingEntity,
    HouseEntity,
    PlotEntity,
    CommerceEntity,
    HouseProjectEntity,
    VillageEntity,
    EntityNormalizer
};
use PHPUnit\Framework\TestCase;

/**
 * Unit тесты для EntityNormalizer
 * 
 * Проверяют:
 * - Правильный выбор Mapper'а по ObjectType
 * - Создание соответствующих Entity
 * - Обработку массивов данных
 * - Исключения при отсутствии Mapper'а
 */
class EntityNormalizerTest extends TestCase
{
    private EntityNormalizer $normalizer;

    protected function setUp(): void
    {
        $this->normalizer = new EntityNormalizer();
    }

    public function test_normalizes_block_data(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Villa Marina'
        ];

        $entity = $this->normalizer->normalize(ObjectType::BLOCKS, $data);

        $this->assertInstanceOf(BlockEntity::class, $entity);
        $this->assertEquals('123', $entity->id);
    }

    public function test_normalizes_apartment_data(): void
    {
        $data = [
            '_id' => '456',
            'rooms' => 2,
            'area' => 65.5,
            'price' => 8000000,
            'floor' => 5
        ];

        $entity = $this->normalizer->normalize(ObjectType::APARTMENTS, $data);

        $this->assertInstanceOf(ApartmentEntity::class, $entity);
        $this->assertEquals('456', $entity->id);
    }

    public function test_normalizes_parking_data(): void
    {
        $data = [
            '_id' => '789',
            'type' => 'underground',
            'area' => 15,
            'price' => 1500000
        ];

        $entity = $this->normalizer->normalize(ObjectType::PARKING, $data);

        $this->assertInstanceOf(ParkingEntity::class, $entity);
        $this->assertEquals('789', $entity->id);
    }

    public function test_normalizes_house_data(): void
    {
        $data = [
            '_id' => '111',
            'rooms' => 30,
            'area' => 200,
            'price' => 15000000,
            'floor' => 1
        ];

        $entity = $this->normalizer->normalize(ObjectType::HOUSES, $data);

        $this->assertInstanceOf(HouseEntity::class, $entity);
        $this->assertTrue($entity->isCottage());
    }

    public function test_normalizes_plot_data(): void
    {
        $data = [
            '_id' => '222',
            'area' => 10,
            'price' => 2000000
        ];

        $entity = $this->normalizer->normalize(ObjectType::PLOTS, $data);

        $this->assertInstanceOf(PlotEntity::class, $entity);
        $this->assertEquals('222', $entity->id);
    }

    public function test_normalizes_commerce_data(): void
    {
        $data = [
            '_id' => '333',
            'type' => 'office',
            'area' => 50,
            'price' => 10000000
        ];

        $entity = $this->normalizer->normalize(ObjectType::COMMERCE, $data);

        $this->assertInstanceOf(CommerceEntity::class, $entity);
        $this->assertEquals('333', $entity->id);
    }

    public function test_normalizes_house_project_data(): void
    {
        $data = [
            '_id' => '444',
            'name' => 'Проект А',
            'area' => 150
        ];

        $entity = $this->normalizer->normalize(ObjectType::HOUSE_PROJECTS, $data);

        $this->assertInstanceOf(HouseProjectEntity::class, $entity);
        $this->assertEquals('444', $entity->id);
    }

    public function test_normalizes_village_data(): void
    {
        $data = [
            '_id' => '555',
            'name' => 'Поселок Тестовый'
        ];

        $entity = $this->normalizer->normalize(ObjectType::VILLAGES, $data);

        $this->assertInstanceOf(VillageEntity::class, $entity);
        $this->assertEquals('555', $entity->id);
    }

    public function test_normalizes_many_items(): void
    {
        $items = [
            ['_id' => '123', 'name' => 'Block 1'],
            ['_id' => '456', 'name' => 'Block 2'],
            ['_id' => '789', 'name' => 'Block 3']
        ];

        $entities = $this->normalizer->normalizeMany(ObjectType::BLOCKS, $items);

        $this->assertCount(3, $entities);
        $this->assertContainsOnlyInstancesOf(BlockEntity::class, $entities);
        $this->assertEquals('123', $entities[0]->id);
        $this->assertEquals('456', $entities[1]->id);
        $this->assertEquals('789', $entities[2]->id);
    }

    public function test_normalize_many_with_empty_array(): void
    {
        $entities = $this->normalizer->normalizeMany(ObjectType::BLOCKS, []);

        $this->assertIsArray($entities);
        $this->assertEmpty($entities);
    }

    public function test_has_factory(): void
    {
        $factory = $this->normalizer->getFactory();

        $this->assertNotNull($factory);
        $this->assertInstanceOf(\App\Services\TrendAgent\Entities\EntityFactory::class, $factory);
    }

    public function test_factory_has_all_mappers_registered(): void
    {
        $factory = $this->normalizer->getFactory();

        foreach (ObjectType::cases() as $objectType) {
            $this->assertTrue(
                $factory->hasMapper($objectType),
                "Factory should have mapper for {$objectType->value}"
            );
        }
    }

    public function test_throws_exception_for_invalid_data(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->normalizer->normalize(ObjectType::BLOCKS, []);
    }
}
