<?php

namespace Tests\Unit\TrendAgent\ValueObjects;

use App\Services\TrendAgent\Entities\ValueObjects\Location;
use PHPUnit\Framework\TestCase;

/**
 * Unit тесты для Location Value Object
 */
class LocationTest extends TestCase
{
    public function test_creates_location_with_all_fields(): void
    {
        $location = new Location(
            latitude: 59.9386,
            longitude: 30.3141,
            address: 'Невский проспект, 1',
            district: 'Центральный',
            metro: [['name' => 'Невский проспект']]
        );

        $this->assertEquals(59.9386, $location->latitude);
        $this->assertEquals(30.3141, $location->longitude);
        $this->assertEquals('Невский проспект, 1', $location->address);
        $this->assertEquals('Центральный', $location->district);
        $this->assertIsArray($location->metro);
    }

    public function test_accepts_null_values(): void
    {
        $location = new Location(null, null, null, null, null);

        $this->assertNull($location->latitude);
        $this->assertNull($location->longitude);
        $this->assertNull($location->address);
        $this->assertNull($location->district);
        $this->assertNull($location->metro);
    }

    public function test_has_coordinates_returns_true_when_both_set(): void
    {
        $location = new Location(59.9, 30.3, null, null, null);

        $this->assertTrue($location->hasCoordinates());
    }

    public function test_has_coordinates_returns_false_when_latitude_missing(): void
    {
        $location = new Location(null, 30.3, null, null, null);

        $this->assertFalse($location->hasCoordinates());
    }

    public function test_has_coordinates_returns_false_when_longitude_missing(): void
    {
        $location = new Location(59.9, null, null, null, null);

        $this->assertFalse($location->hasCoordinates());
    }

    public function test_get_coordinates_returns_array_when_set(): void
    {
        $location = new Location(59.9, 30.3, null, null, null);

        $coords = $location->getCoordinates();

        $this->assertIsArray($coords);
        $this->assertArrayHasKey('lat', $coords);
        $this->assertArrayHasKey('lng', $coords);
        $this->assertEquals(59.9, $coords['lat']);
        $this->assertEquals(30.3, $coords['lng']);
    }

    public function test_get_coordinates_returns_null_when_missing(): void
    {
        $location = new Location(null, null, null, null, null);

        $this->assertNull($location->getCoordinates());
    }

    public function test_creates_from_array_with_coordinates_object(): void
    {
        $data = [
            'coordinates' => ['lat' => 59.9, 'lon' => 30.3],
            'address' => 'Test Address'
        ];

        $location = Location::fromArray($data);

        $this->assertEquals(59.9, $location->latitude);
        $this->assertEquals(30.3, $location->longitude);
        $this->assertEquals('Test Address', $location->address);
    }

    public function test_creates_from_array_with_direct_lat_lng(): void
    {
        $data = [
            'lat' => 59.9,
            'lng' => 30.3
        ];

        $location = Location::fromArray($data);

        $this->assertEquals(59.9, $location->latitude);
        $this->assertEquals(30.3, $location->longitude);
    }

    public function test_creates_from_array_with_geo_object(): void
    {
        $data = [
            'geo' => ['latitude' => 59.9, 'longitude' => 30.3]
        ];

        $location = Location::fromArray($data);

        $this->assertEquals(59.9, $location->latitude);
        $this->assertEquals(30.3, $location->longitude);
    }

    public function test_normalizes_metro_array(): void
    {
        $data = [
            'metro' => ['Невский проспект', 'Гостиный двор']
        ];

        $location = Location::fromArray($data);

        $this->assertIsArray($location->metro);
        $this->assertCount(2, $location->metro);
        $this->assertArrayHasKey('name', $location->metro[0]);
        $this->assertEquals('Невский проспект', $location->metro[0]['name']);
    }

    public function test_preserves_metro_objects(): void
    {
        $data = [
            'metro' => [
                ['name' => 'Невский проспект', 'distance' => 500]
            ]
        ];

        $location = Location::fromArray($data);

        $this->assertArrayHasKey('distance', $location->metro[0]);
        $this->assertEquals(500, $location->metro[0]['distance']);
    }

    public function test_to_array_contains_all_fields(): void
    {
        $location = new Location(59.9, 30.3, 'Address', 'District', null);

        $array = $location->toArray();

        $this->assertArrayHasKey('latitude', $array);
        $this->assertArrayHasKey('longitude', $array);
        $this->assertArrayHasKey('coordinates', $array);
        $this->assertArrayHasKey('address', $array);
        $this->assertArrayHasKey('district', $array);
        $this->assertArrayHasKey('metro', $array);
        $this->assertArrayHasKey('hasCoordinates', $array);
        $this->assertTrue($array['hasCoordinates']);
    }

    public function test_casts_coordinates_to_float(): void
    {
        $data = ['lat' => '59.9', 'lon' => '30.3'];

        $location = Location::fromArray($data);

        $this->assertIsFloat($location->latitude);
        $this->assertIsFloat($location->longitude);
    }
}
