<?php

namespace Tests\Unit\TrendAgent\ValueObjects;

use App\Services\TrendAgent\Entities\ValueObjects\Area;
use PHPUnit\Framework\TestCase;

/**
 * Unit тесты для Area Value Object
 */
class AreaTest extends TestCase
{
    public function test_creates_area_with_valid_value(): void
    {
        $area = new Area(85.5, 'm²');

        $this->assertEquals(85.5, $area->value);
        $this->assertEquals('m²', $area->unit);
    }

    public function test_throws_exception_for_negative_value(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Area cannot be negative');

        new Area(-50, 'm²');
    }

    public function test_accepts_zero_value(): void
    {
        $area = new Area(0, 'm²');

        $this->assertEquals(0, $area->value);
    }

    public function test_defaults_to_square_meters(): void
    {
        $area = new Area(100);

        $this->assertEquals('m²', $area->unit);
    }

    public function test_formats_area_correctly(): void
    {
        $area = new Area(85.5, 'm²');

        $this->assertEquals('85.50 m²', $area->format());
    }

    public function test_formats_with_custom_unit(): void
    {
        $area = new Area(10, 'сотки');

        $this->assertStringContainsString('10.00', $area->format());
        $this->assertStringContainsString('сотки', $area->format());
    }

    public function test_creates_from_array_with_area_key(): void
    {
        $data = ['area' => 75.8];

        $area = Area::fromArray($data);

        $this->assertInstanceOf(Area::class, $area);
        $this->assertEquals(75.8, $area->value);
        $this->assertEquals('m²', $area->unit);
    }

    public function test_creates_from_array_with_custom_key(): void
    {
        $data = ['kitchen_area' => 12.5];

        $area = Area::fromArray($data, 'kitchen_area');

        $this->assertEquals(12.5, $area->value);
    }

    public function test_returns_null_when_area_missing(): void
    {
        $data = [];

        $area = Area::fromArray($data);

        $this->assertNull($area);
    }

    public function test_to_array_contains_all_fields(): void
    {
        $area = new Area(85.5, 'm²');

        $array = $area->toArray();

        $this->assertArrayHasKey('value', $array);
        $this->assertArrayHasKey('unit', $array);
        $this->assertArrayHasKey('formatted', $array);
        $this->assertEquals(85.5, $array['value']);
    }

    public function test_casts_string_to_float(): void
    {
        $data = ['area' => '100.5'];

        $area = Area::fromArray($data);

        $this->assertIsFloat($area->value);
        $this->assertEquals(100.5, $area->value);
    }
}
