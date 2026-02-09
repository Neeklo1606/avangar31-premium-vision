<?php

namespace Tests\Unit\TrendAgent\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\ApartmentEntity;
use App\Services\TrendAgent\Entities\Mappers\ApartmentMapper;
use PHPUnit\Framework\TestCase;

class ApartmentMapperTest extends TestCase
{
    private ApartmentMapper $mapper;

    protected function setUp(): void
    {
        $this->mapper = new ApartmentMapper();
    }

    public function test_supports_apartments_object_type(): void
    {
        $this->assertTrue($this->mapper->supports(ObjectType::APARTMENTS));
        $this->assertFalse($this->mapper->supports(ObjectType::BLOCKS));
    }

    public function test_get_object_type_returns_apartments(): void
    {
        $this->assertEquals(ObjectType::APARTMENTS, $this->mapper->getObjectType());
    }

    public function test_maps_data_to_apartment_entity(): void
    {
        $data = [
            '_id' => '456',
            'rooms' => 2,
            'area' => 65.5,
            'price' => 8000000,
            'floor' => 5
        ];

        $entity = $this->mapper->map($data);

        $this->assertInstanceOf(ApartmentEntity::class, $entity);
        $this->assertEquals('456', $entity->id);
        $this->assertEquals(2, $entity->rooms);
    }

    public function test_validates_required_fields(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->mapper->map(['_id' => '456']);
    }
}
