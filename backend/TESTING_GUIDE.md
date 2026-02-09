# Testing Guide — TrendAgent API Integration

## Быстрый старт

### 1. Установка зависимостей (если ещё не установлены)

```bash
cd backend
composer install
```

**Зависимости для тестирования:**
- ✅ PHPUnit 11.5.3 (установлен)
- ✅ Mockery 1.6 (установлен)

---

## Запуск тестов

### Все тесты

```bash
cd backend
./vendor/bin/phpunit
```

или

```bash
composer test
```

### Только Unit тесты

```bash
./vendor/bin/phpunit tests/Unit
```

### Только Integration тесты

```bash
./vendor/bin/phpunit tests/Integration
```

### Конкретная категория

```bash
# Value Objects
./vendor/bin/phpunit tests/Unit/TrendAgent/ValueObjects

# Entities
./vendor/bin/phpunit tests/Unit/TrendAgent/Entities

# Mappers
./vendor/bin/phpunit tests/Unit/TrendAgent/Mappers

# Normalizer
./vendor/bin/phpunit tests/Unit/TrendAgent/Normalizer

# Architecture
./vendor/bin/phpunit tests/Unit/TrendAgent/ArchitectureTest.php

# Catalog Service
./vendor/bin/phpunit tests/Integration/TrendAgent/CatalogServiceTest.php

# Detail Service
./vendor/bin/phpunit tests/Integration/TrendAgent/DetailServiceTest.php
```

### Конкретный тест

```bash
./vendor/bin/phpunit tests/Unit/TrendAgent/ValueObjects/PriceTest.php
./vendor/bin/phpunit --filter test_creates_price_with_valid_value
```

---

## Дополнительные опции

### С детальным выводом

```bash
./vendor/bin/phpunit --testdox
```

**Вывод:**
```
Price
 ✔ Creates price with valid value
 ✔ Throws exception for negative value
 ✔ Accepts zero value
 ...
```

### С покрытием кода (требует Xdebug)

```bash
# HTML отчёт
./vendor/bin/phpunit --coverage-html coverage

# Открыть отчёт
start coverage/index.html
```

### Только группа тестов

```bash
# Если добавить @group аннотации
./vendor/bin/phpunit --group value-objects
./vendor/bin/phpunit --group entities
./vendor/bin/phpunit --group integration
```

---

## Ожидаемый результат

```
PHPUnit 11.5.3 by Sebastian Bergmann and contributors.

Runtime:       PHP 8.2.x
Configuration: phpunit.xml

...........................................................  136 / 136 (100%)

Time: 00:02.345, Memory: 50.00 MB

OK (136 tests, 450+ assertions)
```

---

## Отладка неудачных тестов

### Verbose режим

```bash
./vendor/bin/phpunit --verbose
```

### Debug конкретного теста

```bash
./vendor/bin/phpunit --filter test_name --debug
```

### Остановка на первой ошибке

```bash
./vendor/bin/phpunit --stop-on-failure
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mbstring, xml, ctype, json
          
      - name: Install dependencies
        run: composer install --prefer-dist --no-progress
        
      - name: Run tests
        run: ./vendor/bin/phpunit
```

---

## Continuous Testing (watch mode)

### С phpunit-watcher (опционально)

```bash
composer require spatie/phpunit-watcher --dev
./vendor/bin/phpunit-watcher watch
```

---

## Troubleshooting

### "Class not found" ошибки

```bash
composer dump-autoload
```

### Cache проблемы

```bash
php artisan config:clear
php artisan cache:clear
php artisan test:clear-cache
```

### Mockery cleanup

Если тесты падают с "Mockery\Exception":
- Проверить `tearDown()` метод содержит `Mockery::close()`
- Запустить тесты изолированно: `--process-isolation`

---

## Структура тестов

```
tests/
├── Unit/
│   └── TrendAgent/
│       ├── ValueObjects/     (4 теста, 59 проверок)
│       ├── Entities/         (2 теста, 23 проверки)
│       ├── Mappers/          (2 теста, 11 проверок)
│       ├── Normalizer/       (1 тест, 16 проверок)
│       └── ArchitectureTest  (12 архитектурных проверок)
│
└── Integration/
    └── TrendAgent/
        ├── CatalogServiceTest  (7 integration тестов)
        └── DetailServiceTest   (8 integration тестов)
```

---

## Добавление новых тестов

### Шаг 1: Создать тест

```php
<?php

namespace Tests\Unit\TrendAgent\NewFeature;

use PHPUnit\Framework\TestCase;

class NewFeatureTest extends TestCase
{
    public function test_something(): void
    {
        // Arrange
        $input = [...];
        
        // Act
        $result = doSomething($input);
        
        // Assert
        $this->assertEquals($expected, $result);
    }
}
```

### Шаг 2: Запустить

```bash
./vendor/bin/phpunit tests/Unit/TrendAgent/NewFeature
```

---

## Best Practices

### 1. Naming Convention

```php
// ✅ Хорошо:
test_creates_entity_from_array()
test_throws_exception_when_invalid()
test_returns_formatted_string()

// ❌ Плохо:
testEntity()
test1()
testSomething()
```

### 2. AAA Pattern (Arrange-Act-Assert)

```php
public function test_example(): void
{
    // Arrange
    $input = ['key' => 'value'];
    
    // Act
    $result = Entity::fromArray($input);
    
    // Assert
    $this->assertEquals('value', $result->key);
}
```

### 3. One assertion per test (желательно)

```php
// ✅ Хорошо:
test_returns_correct_id()
test_returns_correct_name()

// ⚠️ Допустимо:
test_returns_correct_basic_fields()
```

### 4. Mock только внешние зависимости

```php
// ✅ Mock:
- HttpClient (внешние HTTP запросы)
- AuthTokenManager (SSO API)

// ❌ НЕ mock:
- EntityNormalizer (pure logic)
- FilterBuilder (pure logic)
```

---

## Метрики качества

### Coverage Goals

- Value Objects: ≥ 95% ✅
- Entities: ≥ 85% ✅
- Mappers: ≥ 90% ✅
- Normalizer: ≥ 95% ✅

### Assertions per Test

- Минимум: 1
- Среднее: 3-5
- Максимум: 10

### Execution Time

- Unit test: < 0.1s
- Integration test: < 0.5s
- All tests: < 5s

---

## Полезные команды

```bash
# Список всех тестов
./vendor/bin/phpunit --list-tests

# Testdox (readable format)
./vendor/bin/phpunit --testdox

# С цветами
./vendor/bin/phpunit --colors=always

# JSON output
./vendor/bin/phpunit --log-json report.json

# XML для CI
./vendor/bin/phpunit --log-junit junit.xml

# Coverage XML для SonarQube
./vendor/bin/phpunit --coverage-clover coverage.xml
```

---

## FAQ

### Q: Тесты падают с "Call to undefined method"

**A:** Проверить autoload:
```bash
composer dump-autoload
```

### Q: Mockery не работает

**A:** Проверить версию:
```bash
composer show mockery/mockery
```

Обновить если нужно:
```bash
composer require --dev mockery/mockery:^1.6
```

### Q: Тесты медленные

**A:** 
- Проверить, не делаются ли реальные HTTP запросы
- Использовать `--no-coverage` если не нужно покрытие
- Проверить database seeding

---

## Заключение

Тестирование настроено и готово к использованию.

**Команда для запуска:**
```bash
cd backend && ./vendor/bin/phpunit
```

**Ожидаемый результат:**
```
OK (136 tests, 450+ assertions)
```

---

**Дата:** 09.02.2026  
**Версия:** 1.0.0
