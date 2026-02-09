<?php

namespace Tests\Unit\TrendAgent\ValueObjects;

use App\Services\TrendAgent\Entities\ValueObjects\Contact;
use PHPUnit\Framework\TestCase;

/**
 * Unit тесты для Contact Value Object
 */
class ContactTest extends TestCase
{
    public function test_creates_contact_with_all_fields(): void
    {
        $contact = new Contact(
            phone: '+7 (812) 123-45-67',
            email: 'info@example.com',
            website: 'https://example.com'
        );

        $this->assertEquals('+7 (812) 123-45-67', $contact->phone);
        $this->assertEquals('info@example.com', $contact->email);
        $this->assertEquals('https://example.com', $contact->website);
    }

    public function test_accepts_null_values(): void
    {
        $contact = new Contact(null, null, null);

        $this->assertNull($contact->phone);
        $this->assertNull($contact->email);
        $this->assertNull($contact->website);
    }

    public function test_has_any_contact_returns_true_when_phone_set(): void
    {
        $contact = new Contact('+7 123', null, null);

        $this->assertTrue($contact->hasAnyContact());
    }

    public function test_has_any_contact_returns_true_when_email_set(): void
    {
        $contact = new Contact(null, 'test@test.com', null);

        $this->assertTrue($contact->hasAnyContact());
    }

    public function test_has_any_contact_returns_true_when_website_set(): void
    {
        $contact = new Contact(null, null, 'https://test.com');

        $this->assertTrue($contact->hasAnyContact());
    }

    public function test_has_any_contact_returns_false_when_all_null(): void
    {
        $contact = new Contact(null, null, null);

        $this->assertFalse($contact->hasAnyContact());
    }

    public function test_creates_from_array_with_standard_keys(): void
    {
        $data = [
            'phone' => '+7 123',
            'email' => 'test@test.com',
            'website' => 'https://test.com'
        ];

        $contact = Contact::fromArray($data);

        $this->assertEquals('+7 123', $contact->phone);
        $this->assertEquals('test@test.com', $contact->email);
        $this->assertEquals('https://test.com', $contact->website);
    }

    public function test_creates_from_array_with_alternative_keys(): void
    {
        $data = [
            'phone_number' => '+7 123',
            'contact_email' => 'test@test.com',
            'site' => 'https://test.com'
        ];

        $contact = Contact::fromArray($data);

        $this->assertEquals('+7 123', $contact->phone);
        $this->assertEquals('test@test.com', $contact->email);
        $this->assertEquals('https://test.com', $contact->website);
    }

    public function test_creates_from_array_with_contact_phone_key(): void
    {
        $data = ['contact_phone' => '+7 123'];

        $contact = Contact::fromArray($data);

        $this->assertEquals('+7 123', $contact->phone);
    }

    public function test_creates_from_array_with_url_key(): void
    {
        $data = ['url' => 'https://test.com'];

        $contact = Contact::fromArray($data);

        $this->assertEquals('https://test.com', $contact->website);
    }

    public function test_creates_from_empty_array(): void
    {
        $contact = Contact::fromArray([]);

        $this->assertNull($contact->phone);
        $this->assertNull($contact->email);
        $this->assertNull($contact->website);
        $this->assertFalse($contact->hasAnyContact());
    }

    public function test_to_array_contains_all_fields(): void
    {
        $contact = new Contact('+7 123', 'test@test.com', 'https://test.com');

        $array = $contact->toArray();

        $this->assertArrayHasKey('phone', $array);
        $this->assertArrayHasKey('email', $array);
        $this->assertArrayHasKey('website', $array);
        $this->assertArrayHasKey('hasAnyContact', $array);
        $this->assertTrue($array['hasAnyContact']);
    }

    public function test_to_array_shows_false_when_no_contacts(): void
    {
        $contact = new Contact(null, null, null);

        $array = $contact->toArray();

        $this->assertFalse($array['hasAnyContact']);
    }
}
