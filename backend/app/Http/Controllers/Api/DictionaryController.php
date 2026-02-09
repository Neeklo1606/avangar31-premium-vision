<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TrendAgent\Dictionaries\DictionaryService;
use App\Services\TrendAgent\Core\ObjectType;
use Illuminate\Http\JsonResponse;

/**
 * Контроллер для работы со справочниками
 * 
 * ПРИМЕР интеграции TrendAgent через Laravel DI
 */
class DictionaryController extends Controller
{
    public function __construct(
        private readonly DictionaryService $dictionaryService
    ) {}

    /**
     * Получить все справочники для типа объекта
     * 
     * GET /api/dictionaries/{type}
     * 
     * Примеры:
     * - GET /api/dictionaries/blocks
     * - GET /api/dictionaries/apartments
     */
    public function all(string $type): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);

            $dictionaries = $this->dictionaryService->getAllDictionaries($objectType);

            return response()->json([
                'success' => true,
                'data' => $dictionaries,
            ]);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Dictionaries fetch failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Получить конкретный справочник
     * 
     * GET /api/dictionaries/{type}/{key}
     * 
     * Примеры:
     * - GET /api/dictionaries/blocks/districts
     * - GET /api/dictionaries/apartments/rooms
     */
    public function show(string $type, string $key): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);

            $dictionary = $this->dictionaryService->getDictionary($objectType, $key);

            return response()->json([
                'success' => true,
                'data' => [
                    'key' => $key,
                    'values' => $dictionary,
                ],
            ]);

        } catch (\ValueError $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid object type',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Dictionary fetch failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
