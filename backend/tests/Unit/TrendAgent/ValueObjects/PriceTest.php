<?php

namespace Tests\Unit\TrendAgent\ValueObjects;

use App\Services\TrendAgent\Entities\ValueObjects\Price;
use PHPUnit\Framework\TestCase;

/**
 * Unit тесты для Price Value Object
 * 
 * Проверяют:
 * - Валидацию (негативные значения)
 * - Форматирование (разные валюты)
 * - Создание из массива API
 */
class PriceTest extends TestCase
{
    public function test_creates_price_with_valid_value(): void
    {
        $price = new Price(5000000, 'RUB');

        $this->assertEquals(5000000, $price->value);
        $this->assertEquals('RUB', $price->currency);
    }

    public function test_throws_exception_for_negative_value(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Price cannot be negative');

        new Price(-1000, 'RUB');
    }

    public function test_accepts_zero_value(): void
    {
        $price = new Price(0, 'RUB');

        $this->assertEquals(0, $price->value);
    }

    public function test_defaults_to_rub_currency(): void
    {
        $price = new Price(1000000);

        $this->assertEquals('RUB', $price->currency);
    }

    public function test_formats_rub_price_correctly(): void
    {
        $price = new Price(5000000, 'RUB');

        $this->assertEquals('5 000 000 ₽', $price->format());
    }

    public function test_formats_usd_price_correctly(): void
    {
        $price = new Price(50000, 'USD');

        $this->assertEquals('$50 000', $price->format());
    }

    public function test_formats_eur_price_correctly(): void
    {
        $price = new Price(45000, 'EUR');

        $this->assertEquals('€45 000', $price->format());
    }

    public function test_creates_from_array_with_price_key(): void
    {
        $data = ['price' => 3000000];

        $price = Price::fromArray($data);

        $this->assertInstanceOf(Price::class, $price);
        $this->assertEquals(3000000, $price->value);
        $this->assertEquals('RUB', $price->currency);
    }

    public function test_creates_from_array_with_custom_key(): void
    {
        $data = ['price_from' => 2000000];

        $price = Price::fromArray($data, 'price_from');

        $this->assertInstanceOf(Price::class, $price);
        $this->assertEquals(2000000, $price->value);
    }

    public function test_creates_from_array_with_currency(): void
    {
        $data = [
            'price' => 50000,
            'currency' => 'USD'
        ];

        $price = Price::fromArray($data);

        $this->assertEquals('USD', $price->currency);
    }

    public function test_returns_null_when_price_missing(): void
    {
        $data = [];

        $price = Price::fromArray($data);

        $this->assertNull($price);
    }

    public function test_to_array_contains_all_fields(): void
    {
        $price = new Price(5000000, 'RUB');

        $array = $price->toArray();

        $this->assertArrayHasKey('value', $array);
        $this->assertArrayHasKey('currency', $array);
        $this->assertArrayHasKey('formatted', $array);
        $this->assertEquals(5000000, $array['value']);
        $this->assertEquals('RUB', $array['currency']);
        $this->assertEquals('5 000 000 ₽', $array['formatted']);
    }

    public function test_handles_float_values(): void
    {
        $price = new Price(5000000.50, 'RUB');

        $this->assertEquals(5000000.50, $price->value);
    }

    public function test_casts_string_to_float_from_array(): void
    {
        $data = ['price' => '3500000'];

        $price = Price::fromArray($data);

        $this->assertIsFloat($price->value);
        $this->assertEquals(3500000.0, $price->value);
    }
}
