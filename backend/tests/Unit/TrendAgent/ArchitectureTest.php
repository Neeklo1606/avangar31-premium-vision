<?php

namespace Tests\Unit\TrendAgent;

use PHPUnit\Framework\TestCase;

/**
 * Архитектурные тесты
 * 
 * Проверяют фундаментальные архитектурные гарантии:
 * - Entity не содержит HTTP логики
 * - Entity не зависит от HttpClient
 * - Mapper не делает HTTP
 * - Normalizer не знает о transport layer
 */
class ArchitectureTest extends TestCase
{
    public function test_entities_do_not_import_http_client(): void
    {
        $entityFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/*Entity.php');

        foreach ($entityFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringNotContainsString(
                'use Illuminate\Http\Client',
                $content,
                basename($file) . ' should not import HTTP client'
            );
            
            $this->assertStringNotContainsString(
                'use App\Services\TrendAgent\Http\HttpClient',
                $content,
                basename($file) . ' should not import HttpClient'
            );
        }
    }

    public function test_entities_do_not_make_http_calls(): void
    {
        $entityFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/*Entity.php');

        foreach ($entityFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringNotContainsString(
                'Http::',
                $content,
                basename($file) . ' should not make HTTP calls'
            );
            
            $this->assertStringNotContainsString(
                '->get(',
                $content,
                basename($file) . ' should not contain HTTP get() calls'
            );
            
            $this->assertStringNotContainsString(
                '->post(',
                $content,
                basename($file) . ' should not contain HTTP post() calls'
            );
        }
    }

    public function test_value_objects_do_not_import_http(): void
    {
        $voFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/ValueObjects/*.php');

        foreach ($voFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringNotContainsString(
                'Http',
                $content,
                basename($file) . ' should not reference HTTP'
            );
        }
    }

    public function test_mappers_do_not_import_http_client(): void
    {
        $mapperFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/Mappers/*Mapper.php');

        foreach ($mapperFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringNotContainsString(
                'use App\Services\TrendAgent\Http\HttpClient',
                $content,
                basename($file) . ' should not import HttpClient'
            );
            
            $this->assertStringNotContainsString(
                'Http::',
                $content,
                basename($file) . ' should not make HTTP calls'
            );
        }
    }

    public function test_normalizer_does_not_import_http_client(): void
    {
        $normalizerFile = __DIR__ . '/../../../app/Services/TrendAgent/Entities/EntityNormalizer.php';
        $content = file_get_contents($normalizerFile);

        $this->assertStringNotContainsString(
            'use App\Services\TrendAgent\Http\HttpClient',
            $content,
            'EntityNormalizer should not import HttpClient'
        );
        
        $this->assertStringNotContainsString(
            'Http::',
            $content,
            'EntityNormalizer should not make HTTP calls'
        );
    }

    public function test_entity_factory_does_not_import_http(): void
    {
        $factoryFile = __DIR__ . '/../../../app/Services/TrendAgent/Entities/EntityFactory.php';
        $content = file_get_contents($factoryFile);

        $this->assertStringNotContainsString(
            'Http',
            $content,
            'EntityFactory should not reference HTTP'
        );
    }

    public function test_all_entities_are_readonly(): void
    {
        $entityFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/*Entity.php');

        foreach ($entityFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringContainsString(
                'readonly class',
                $content,
                basename($file) . ' should be readonly'
            );
        }
    }

    public function test_all_value_objects_are_readonly(): void
    {
        $voFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/ValueObjects/*.php');

        foreach ($voFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringContainsString(
                'readonly class',
                $content,
                basename($file) . ' should be readonly'
            );
        }
    }

    public function test_entities_extend_abstract_entity(): void
    {
        $entityFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/*Entity.php');
        
        // Исключаем AbstractEntity
        $entityFiles = array_filter($entityFiles, function($file) {
            return !str_contains($file, 'AbstractEntity.php');
        });

        foreach ($entityFiles as $file) {
            $content = file_get_contents($file);
            
            // Проверяем, что класс наследуется от AbstractEntity или другой Entity
            $hasInheritance = str_contains($content, 'extends AbstractEntity') 
                           || str_contains($content, 'extends ApartmentEntity');
            
            $this->assertTrue(
                $hasInheritance,
                basename($file) . ' should extend AbstractEntity or another Entity'
            );
        }
    }

    public function test_all_entities_have_from_array_method(): void
    {
        $entityFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/*Entity.php');
        
        // Исключаем AbstractEntity
        $entityFiles = array_filter($entityFiles, function($file) {
            return !str_contains($file, 'AbstractEntity.php');
        });

        foreach ($entityFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringContainsString(
                'public static function fromArray',
                $content,
                basename($file) . ' should have fromArray() method'
            );
        }
    }

    public function test_entities_namespace_is_correct(): void
    {
        $entityFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/*Entity.php');

        foreach ($entityFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringContainsString(
                'namespace App\Services\TrendAgent\Entities',
                $content,
                basename($file) . ' should have correct namespace'
            );
        }
    }

    public function test_mappers_implement_entity_mapper_interface(): void
    {
        $mapperFiles = glob(__DIR__ . '/../../../app/Services/TrendAgent/Entities/Mappers/*Mapper.php');
        
        // Исключаем interface и abstract
        $mapperFiles = array_filter($mapperFiles, function($file) {
            return !str_contains($file, 'EntityMapper.php') 
                && !str_contains($file, 'AbstractMapper.php');
        });

        foreach ($mapperFiles as $file) {
            $content = file_get_contents($file);
            
            $this->assertStringContainsString(
                'extends AbstractMapper',
                $content,
                basename($file) . ' should extend AbstractMapper'
            );
        }
    }
}
