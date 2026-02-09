<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TrendAgent\Dictionaries\DictionaryService;
use App\Services\TrendAgent\Core\ObjectType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
     * GET /api/dictionaries/{type}?city=58c665588b6aa52311afa01b
     */
    public function all(Request $request, string $type): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);
            $city = $request->input('city', '58c665588b6aa52311afa01b');

            $dictionaries = $this->dictionaryService->getAllDictionaries($objectType, $city);

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
     * GET /api/dictionaries/{type}/{key}?city=...
     */
    public function show(Request $request, string $type, string $key): JsonResponse
    {
        try {
            $objectType = ObjectType::from($type);
            $city = $request->input('city', '58c665588b6aa52311afa01b');

            $dictionary = $this->dictionaryService->getDictionary($objectType, $key, $city);

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
