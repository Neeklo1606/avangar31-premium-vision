<?php

namespace App\Console\Commands\TrendAgent;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Catalog\CatalogService;
use App\Services\TrendAgent\Detail\DetailService;
use App\Services\TrendAgent\Media\MediaService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

/**
 * Команда для парсинга данных TrendAgent
 * 
 * Использование:
 *   php artisan trendagent:parse
 *   php artisan trendagent:parse --region=spb --type=blocks --type=apartments
 *   php artisan trendagent:parse --limit=1000
 *   php artisan trendagent:parse --details --media (получить ВСЕ данные)
 */
class ParseCommand extends Command
{
    protected $signature = 'trendagent:parse
                            {--region=* : ID региона (spb, msk, krd и т.д.), по умолчанию spb}
                            {--type=* : Типы объектов для парсинга (blocks, apartments и т.д.), по умолчанию все}
                            {--limit=0 : Максимальное количество объектов для парсинга (0 = все)}
                            {--per-page=100 : Количество объектов за один запрос}
                            {--details : Получить детальные данные для каждого объекта (медленнее, но полнее)}
                            {--media : Получить все медиа (фото, планировки, видео, документы)}';

    protected $description = 'Парсинг всех данных TrendAgent с сохранением в файлы';

    private array $regionMap = [
        'spb' => '58c665588b6aa52311afa01b',
        'msk' => '5a5cb42159042faa9a218d04',
        'krd' => '604b5243f9760700074ac345',
        'rnd' => '61926fb5bb267a0008de132b',
        'crimea' => '682700dd0e7daf77097d0779',
        'kzn' => '642157fca50429d21e3aa14f',
        'ufa' => '674eff862307c824cf56ced3',
        'ekb' => '650974f78d34c0f790a012a9',
        'nsk' => '618120c1a56997000866c4d8',
    ];

    private array $typeLabels = [
        'blocks' => 'Комплексы (ЖК)',
        'apartments' => 'Квартиры',
        'parking' => 'Паркинги (машиноместа)',
        'houses' => 'Дома',
        'plots' => 'Участки',
        'commerce' => 'Коммерция (помещения)',
        'house_projects' => 'Проекты домов',
        'villages' => 'Поселки',
    ];

    private array $results = [];
    private bool $withDetails = false;
    private bool $withMedia = false;

    public function __construct(
        private readonly CatalogService $catalogService,
        private readonly DetailService $detailService,
        private readonly MediaService $mediaService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('🚀 Запуск парсинга TrendAgent...');
        $this->newLine();

        // Получить параметры
        $regions = $this->option('region') ?: ['spb'];
        $types = $this->option('type') ?: array_keys($this->typeLabels);
        $limit = (int) $this->option('limit');
        $perPage = (int) $this->option('per-page');
        $this->withDetails = $this->option('details');
        $this->withMedia = $this->option('media');

        // Валидация типов
        $validTypes = array_keys($this->typeLabels);
        foreach ($types as $type) {
            if (!in_array($type, $validTypes, true)) {
                $this->error("❌ Неизвестный тип объекта: {$type}");
                $this->line("Доступные типы: " . implode(', ', $validTypes));
                return self::FAILURE;
            }
        }

        // Валидация регионов
        foreach ($regions as $region) {
            if (!isset($this->regionMap[$region])) {
                $this->error("❌ Неизвестный регион: {$region}");
                $this->line("Доступные регионы: " . implode(', ', array_keys($this->regionMap)));
                return self::FAILURE;
            }
        }

        $this->info("📍 Регионы: " . implode(', ', $regions));
        $this->info("📦 Типы объектов: " . implode(', ', $types));
        $this->info("🔢 Лимит: " . ($limit > 0 ? $limit : 'без ограничений'));
        
        if ($this->withDetails) {
            $this->warn("⚠️  Режим детальных данных (медленнее, запрос detail для каждого объекта)");
        }
        if ($this->withMedia) {
            $this->warn("⚠️  Режим получения медиа (фото, планировки, видео, документы)");
        }
        
        $this->newLine();

        // Парсинг для каждого региона и типа
        foreach ($regions as $region) {
            $cityId = $this->regionMap[$region];
            $this->info("🌍 Регион: {$region} (ID: {$cityId})");
            $this->newLine();

            foreach ($types as $type) {
                try {
                    $objectType = ObjectType::from($type);
                    $count = $this->parseType($region, $cityId, $objectType, $limit, $perPage);
                    $this->results[$type] = ($this->results[$type] ?? 0) + $count;
                } catch (\Exception $e) {
                    $this->error("❌ Ошибка при парсинге {$type}: {$e->getMessage()}");
                    Log::error("TrendAgent parse error", [
                        'region' => $region,
                        'type' => $type,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            $this->newLine();
        }

        // Вывести итоговую таблицу
        $this->displayResults();

        $this->newLine();
        $this->info('✅ Парсинг завершён');

        return self::SUCCESS;
    }

    /**
     * Парсинг объектов одного типа для региона
     */
    private function parseType(
        string $region,
        string $cityId,
        ObjectType $objectType,
        int $limit,
        int $perPage
    ): int {
        $label = $this->typeLabels[$objectType->value];
        $this->line("  📦 {$label}...");

        // Получить общее количество
        try {
            $total = $this->catalogService->getCount($objectType, $cityId, null);
        } catch (\Exception $e) {
            $this->warn("    ⚠️  Не удалось получить количество: {$e->getMessage()}");
            $total = 0;
        }

        if ($total === 0) {
            $this->line("    ℹ️  Нет данных");
            return 0;
        }

        $this->line("    📊 Всего в API: {$total}");

        // Определить, сколько объектов нужно получить
        $toParse = ($limit > 0 && $limit < $total) ? $limit : $total;
        $this->line("    🔄 Получаю: {$toParse}");

        // Получить объекты с пагинацией
        $allItems = [];
        $page = 1;
        $progressBar = $this->output->createProgressBar($toParse);
        $progressBar->setFormat('    [%bar%] %current%/%max% (%percent:3s%%)');
        $progressBar->start();

        while (count($allItems) < $toParse) {
            try {
                $result = $this->catalogService->getCatalog(
                    objectType: $objectType,
                    city: $cityId,
                    filters: [],
                    page: $page,
                    perPage: $perPage
                );

                $items = $result->items;
                
                if (empty($items)) {
                    break;
                }

                // Преобразовать Entity в массивы для сохранения
                foreach ($items as $item) {
                    if (count($allItems) >= $toParse) {
                        break 2;
                    }
                    
                    // Получить детальные данные если нужно
                    if ($this->withDetails) {
                        $itemData = $this->getDetailedData($objectType, $item->getId(), $cityId);
                    } else {
                        $itemData = $item->toArray();
                    }
                    
                    // Получить медиа если нужно
                    if ($this->withMedia && !$this->withDetails) {
                        // Если details уже получены, медиа там есть
                        $itemData['media'] = $this->getMediaData($objectType, $item->getId(), $cityId);
                    }
                    
                    $allItems[] = $itemData;
                    $progressBar->advance();
                }

                $page++;
                
                // Небольшая задержка чтобы не перегружать API
                usleep(100000); // 0.1 секунда

            } catch (\Exception $e) {
                $this->newLine();
                $this->warn("    ⚠️  Ошибка на странице {$page}: {$e->getMessage()}");
                break;
            }
        }

        $progressBar->finish();
        $this->newLine();

        // Сохранить в файл
        $filename = "{$region}_{$objectType->value}.json";
        $path = "trendagent/parser/{$region}/{$filename}";
        
        Storage::disk('local')->put($path, json_encode([
            'region' => $region,
            'city_id' => $cityId,
            'type' => $objectType->value,
            'label' => $label,
            'total_in_api' => $total,
            'parsed' => count($allItems),
            'timestamp' => now()->toIso8601String(),
            'data' => $allItems,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $savedPath = storage_path("app/{$path}");
        $this->line("    💾 Сохранено: {$savedPath}");
        $this->line("    ✅ Получено объектов: " . count($allItems));

        return $total;
    }

    /**
     * Получить детальные данные объекта (все поля, агрегация endpoint'ов)
     */
    private function getDetailedData(ObjectType $objectType, string $id, string $cityId): array
    {
        try {
            $detailResult = $this->detailService->getDetail($objectType, $id, $cityId);
            
            // DetailResult содержит: entity, media, related, meta
            return [
                'id' => $id,
                'entity' => $detailResult->entity->toArray(),
                'media' => $detailResult->media->toArray(),
                'related' => $detailResult->related,
                'meta' => [
                    'object_type' => $objectType->value,
                    'id' => $id,
                    'is_complete' => $detailResult->isComplete,
                    'failed_endpoints' => $detailResult->failedEndpoints,
                ],
            ];
        } catch (\Exception $e) {
            Log::warning("Failed to get details for {$objectType->value} {$id}", [
                'error' => $e->getMessage(),
            ]);
            
            // Вернуть базовые данные если detail не получен
            return [
                'id' => $id,
                'error' => 'Details not available: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Получить медиа объекта (фото, планировки, видео, документы)
     */
    private function getMediaData(ObjectType $objectType, string $id, string $cityId): array
    {
        try {
            $mediaCollection = $this->mediaService->getMedia($objectType, $id, $cityId);
            return $mediaCollection->toArray();
        } catch (\Exception $e) {
            Log::warning("Failed to get media for {$objectType->value} {$id}", [
                'error' => $e->getMessage(),
            ]);
            
            return [
                'photos' => [],
                'videos' => [],
                'documents' => [],
                'floorPlans' => [],
                'progress' => [],
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Вывести итоговую таблицу
     */
    private function displayResults(): void
    {
        $this->newLine();
        $this->info('📊 Итоговая статистика:');
        $this->newLine();

        $headers = ['Тип объекта', 'Всего в API'];
        $rows = [];

        foreach ($this->typeLabels as $type => $label) {
            if (isset($this->results[$type])) {
                $rows[] = [
                    $label,
                    number_format($this->results[$type], 0, '.', ' '),
                ];
            }
        }

        $this->table($headers, $rows);
        
        if ($this->withDetails) {
            $this->newLine();
            $this->info('ℹ️  Для каждого объекта получены детальные данные:');
            $this->line('  - Все поля entity');
            $this->line('  - Медиа (фото, видео, документы, планировки)');
            $this->line('  - Связанные данные (для ЖК: advantages, finishings, geo, buildings и т.д.)');
            $this->line('  - Агрегация всех endpoint\'ов (для blocks - 22 источника)');
        }
    }
}
