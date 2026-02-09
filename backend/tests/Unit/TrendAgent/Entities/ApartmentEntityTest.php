<?php

namespace Tests\Unit\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\ApartmentEntity;
use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area};
use PHPUnit\Framework\TestCase;

/**
 * Unit тесты для ApartmentEntity
 */
class ApartmentEntityTest extends TestCase
{
    public function test_creates_from_array_with_required_fields(): void
    {
        $data = [
            '_id' => '456',
            'rooms' => 2,
            'area' => 65.5,
            'price' => 8000000,
            'floor' => 5
        ];

        $apartment = ApartmentEntity::fromArray($data);

        $this->assertEquals('456', $apartment->id);
        $this->assertEquals(2, $apartment->rooms);
        $this->assertInstanceOf(Area::class, $apartment->area);
        $this->assertEquals(65.5, $apartment->area->value);
        $this->assertInstanceOf(Price::class, $apartment->price);
        $this->assertEquals(8000000, $apartment->price->value);
        $this->assertEquals(5, $apartment->floor);
    }

    public function test_throws_exception_when_price_missing(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Price is required');

        ApartmentEntity::fromArray([
            '_id' => '456',
            'area' => 65.5,
            'floor' => 5
        ]);
    }

    public function test_throws_exception_when_area_missing(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Area is required');

        ApartmentEntity::fromArray([
            '_id' => '456',
            'price' => 8000000,
            'floor' => 5
        ]);
    }

    public function test_is_studio_returns_true_for_zero_rooms(): void
    {
        $data = [
            '_id' => '456',
            'rooms' => 0,
            'area' => 30,
            'price' => 5000000,
            'floor' => 3
        ];

        $apartment = ApartmentEntity::fromArray($data);

        $this->assertTrue($apartment->isStudio());
    }

    public function test_is_studio_returns_false_for_non_zero_rooms(): void
    {
        $data = [
            '_id' => '456',
            'rooms' => 1,
            'area' => 40,
            'price' => 6000000,
            'floor' => 3
        ];

        $apartment = ApartmentEntity::fromArray($data);

        $this->assertFalse($apartment->isStudio());
    }

    public function test_get_rooms_label_for_studio(): void
    {
        $data = [
            '_id' => '456',
            'rooms' => 0,
            'area' => 30,
            'price' => 5000000,
            'floor' => 3
        ];

        $apartment = ApartmentEntity::fromArray($data);

        $this->assertEquals('Студия', $apartment->getRoomsLabel());
    }

    public function test_get_rooms_label_for_regular_apartment(): void
    {
        $data = [
            '_id' => '456',
            'rooms' => 2,
            'area' => 65,
            'price' => 8000000,
            'floor' => 5
        ];

        $apartment = ApartmentEntity::fromArray($data);

        $this->assertEquals('2-комнатная', $apartment->getRoomsLabel());
    }

    public function test_normalizes_alternative_field_names(): void
    {
        $data = [
            '_id' => '456',
            'room' => 3,
            'total_floors' => 15,
            'apartment_number' => '42',
            'layout' => 'layout-id-123',
            'finish' => 'white_box',
            'state' => 'available',
            'area' => 85,
            'price' => 10000000,
            'floor' => 7
        ];

        $apartment = ApartmentEntity::fromArray($data);

        $this->assertEquals(3, $apartment->rooms);
        $this->assertEquals(15, $apartment->floorsTotal);
        $this->assertEquals('42', $apartment->number);
        $this->assertEquals('layout-id-123', $apartment->layoutId);
        $this->assertEquals('white_box', $apartment->finishing);
        $this->assertEquals('available', $apartment->status);
    }

    public function test_creates_kitchen_and_living_areas(): void
    {
        $data = [
            '_id' => '456',
            'area' => 85,
            'kitchen_area' => 15,
            'living_area' => 55,
            'price' => 10000000,
            'floor' => 7
        ];

        $apartment = ApartmentEntity::fromArray($data);

        $this->assertInstanceOf(Area::class, $apartment->kitchenArea);
        $this->assertEquals(15, $apartment->kitchenArea->value);
        
        $this->assertInstanceOf(Area::class, $apartment->livingArea);
        $this->assertEquals(55, $apartment->livingArea->value);
    }
}
