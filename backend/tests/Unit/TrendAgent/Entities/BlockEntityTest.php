<?php

namespace Tests\Unit\TrendAgent\Entities;

use App\Services\TrendAgent\Entities\BlockEntity;
use App\Services\TrendAgent\Entities\ValueObjects\{Price, Area, Location, Contact};
use PHPUnit\Framework\TestCase;

/**
 * Unit тесты для BlockEntity
 * 
 * Проверяют:
 * - Создание из массива API
 * - Нормализацию разных форматов полей
 * - Создание Value Objects
 * - Семантические методы
 */
class BlockEntityTest extends TestCase
{
    public function test_creates_from_array_with_minimal_data(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Villa Marina'
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertEquals('123', $block->id);
        $this->assertEquals('Villa Marina', $block->name);
    }

    public function test_creates_from_array_with_all_fields(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Villa Marina',
            'guid' => 'villa-marina-guid',
            'slug' => 'villa-marina',
            'description' => 'Элитный жилой комплекс',
            'price_from' => 5000000,
            'price_to' => 15000000,
            'area_from' => 40,
            'area_to' => 120,
            'lat' => 59.9,
            'lng' => 30.3,
            'address' => 'Test Address',
            'status' => 'building',
            'deadline' => '2025-12-31',
            'developer' => 'Test Developer',
            'class' => 'comfort',
            'apartments_count' => 100,
            'buildings_count' => 5,
            'floors_count' => 15,
            'phone' => '+7 123',
            'images' => ['image1.jpg', 'image2.jpg']
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertEquals('123', $block->id);
        $this->assertEquals('Villa Marina', $block->name);
        $this->assertEquals('villa-marina-guid', $block->guid);
        $this->assertEquals('villa-marina', $block->slug);
        $this->assertEquals('Элитный жилой комплекс', $block->description);
        
        $this->assertInstanceOf(Price::class, $block->priceFrom);
        $this->assertEquals(5000000, $block->priceFrom->value);
        
        $this->assertInstanceOf(Price::class, $block->priceTo);
        $this->assertEquals(15000000, $block->priceTo->value);
        
        $this->assertInstanceOf(Area::class, $block->areaFrom);
        $this->assertEquals(40, $block->areaFrom->value);
        
        $this->assertInstanceOf(Location::class, $block->location);
        $this->assertEquals(59.9, $block->location->latitude);
        
        $this->assertEquals('building', $block->status);
        $this->assertEquals('Test Developer', $block->developer);
        $this->assertEquals('comfort', $block->class);
        $this->assertEquals(100, $block->apartmentsCount);
        $this->assertEquals(5, $block->buildingsCount);
        $this->assertEquals(15, $block->floorsCount);
        
        $this->assertInstanceOf(Contact::class, $block->contact);
        $this->assertEquals('+7 123', $block->contact->phone);
        
        $this->assertCount(2, $block->images);
    }

    public function test_normalizes_alternative_field_names(): void
    {
        $data = [
            '_id' => '123',
            'title' => 'Test Block',
            'min_price' => 3000000,
            'max_price' => 10000000,
            'min_area' => 50,
            'max_area' => 100,
            'state' => 'ready',
            'completion_date' => '2025-01-01',
            'developer_name' => 'Developer Name',
            'housing_class' => 'business',
            'max_floor' => 20,
            'photos' => ['photo1.jpg']
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertEquals('Test Block', $block->name);
        $this->assertEquals(3000000, $block->priceFrom->value);
        $this->assertEquals(10000000, $block->priceTo->value);
        $this->assertEquals(50, $block->areaFrom->value);
        $this->assertEquals(100, $block->areaTo->value);
        $this->assertEquals('ready', $block->status);
        $this->assertEquals('Developer Name', $block->developer);
        $this->assertEquals('business', $block->class);
        $this->assertEquals(20, $block->floorsCount);
        $this->assertCount(1, $block->images);
    }

    public function test_uses_guid_as_slug_fallback(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Test',
            'guid' => 'test-guid'
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertEquals('test-guid', $block->slug);
    }

    public function test_has_price_range_returns_true_when_both_set(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Test',
            'price_from' => 1000000,
            'price_to' => 5000000
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertTrue($block->hasPriceRange());
    }

    public function test_has_price_range_returns_false_when_one_missing(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Test',
            'price_from' => 1000000
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertFalse($block->hasPriceRange());
    }

    public function test_has_area_range_returns_true_when_both_set(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Test',
            'area_from' => 40,
            'area_to' => 120
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertTrue($block->hasAreaRange());
    }

    public function test_get_stats_returns_correct_data(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Test',
            'apartments_count' => 100,
            'buildings_count' => 5,
            'floors_count' => 15
        ];

        $block = BlockEntity::fromArray($data);

        $stats = $block->getStats();

        $this->assertArrayHasKey('apartments', $stats);
        $this->assertArrayHasKey('buildings', $stats);
        $this->assertArrayHasKey('floors', $stats);
        $this->assertEquals(100, $stats['apartments']);
        $this->assertEquals(5, $stats['buildings']);
        $this->assertEquals(15, $stats['floors']);
    }

    public function test_parses_deadline_from_string(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Test',
            'deadline' => '2025-12-31'
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertInstanceOf(\DateTimeImmutable::class, $block->deadline);
        $this->assertEquals('2025', $block->deadline->format('Y'));
    }

    public function test_stores_raw_data(): void
    {
        $data = [
            '_id' => '123',
            'name' => 'Test',
            'custom_field' => 'custom_value'
        ];

        $block = BlockEntity::fromArray($data);

        $this->assertEquals($data, $block->getRawData());
        $this->assertArrayHasKey('custom_field', $block->getRawData());
    }

    public function test_throws_exception_when_id_missing(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('ID is required');

        BlockEntity::fromArray(['name' => 'Test']);
    }
}
