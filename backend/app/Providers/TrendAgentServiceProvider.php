<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\TrendAgent\Auth\AuthTokenManager;
use App\Services\TrendAgent\Http\{HttpClient, RetryManager, ResponseNormalizer, ParallelExecutor};
use App\Services\TrendAgent\Router\{ObjectTypeResolver, EndpointBuilder};
use App\Services\TrendAgent\Filters\{FilterRegistry, FilterBuilder};
use App\Services\TrendAgent\Dictionaries\{CacheManager, DictionaryAdapter, DictionaryService};
use App\Services\TrendAgent\Catalog\{PaginationManager, CatalogService};
use App\Services\TrendAgent\Detail\{DetailAggregator, SlugResolver, DetailService};
use App\Services\TrendAgent\Detail\Strategies\BlockDetailStrategy;
use App\Services\TrendAgent\Media\MediaService;
use App\Services\TrendAgent\Entities\EntityNormalizer;

/**
 * ServiceProvider для TrendAgent API Integration
 * 
 * Регистрирует все сервисы в Laravel DI контейнере
 * НЕ меняет существующую архитектуру
 */
class TrendAgentServiceProvider extends ServiceProvider
{
    /**
     * Register services
     */
    public function register(): void
    {
        // Мержим конфигурацию
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/trendagent.php',
            'trendagent'
        );

        // AUTH LAYER
        $this->app->singleton(AuthTokenManager::class, function ($app) {
            return new AuthTokenManager();
        });

        // HTTP LAYER
        $this->app->singleton(HttpClient::class, function ($app) {
            return new HttpClient();
        });

        $this->app->singleton(RetryManager::class, function ($app) {
            return new RetryManager();
        });

        $this->app->singleton(ResponseNormalizer::class, function ($app) {
            return new ResponseNormalizer();
        });

        $this->app->singleton(ParallelExecutor::class, function ($app) {
            return new ParallelExecutor(
                $app->make(HttpClient::class)
            );
        });

        // ROUTER LAYER
        $this->app->singleton(ObjectTypeResolver::class, function ($app) {
            return new ObjectTypeResolver();
        });

        $this->app->singleton(EndpointBuilder::class, function ($app) {
            return new EndpointBuilder(
                $app->make(AuthTokenManager::class)
            );
        });

        // ENTITY LAYER
        $this->app->singleton(EntityNormalizer::class, function ($app) {
            return new EntityNormalizer();
        });

        // FILTERS LAYER
        $this->app->singleton(FilterRegistry::class, function ($app) {
            return new FilterRegistry();
        });

        $this->app->singleton(FilterBuilder::class, function ($app) {
            return new FilterBuilder(
                $app->make(FilterRegistry::class)
            );
        });

        // DICTIONARIES LAYER
        $this->app->singleton(CacheManager::class, function ($app) {
            return new CacheManager();
        });

        $this->app->singleton(DictionaryAdapter::class, function ($app) {
            return new DictionaryAdapter();
        });

        $this->app->singleton(DictionaryService::class, function ($app) {
            return new DictionaryService(
                $app->make(ObjectTypeResolver::class),
                $app->make(EndpointBuilder::class),
                $app->make(HttpClient::class),
                $app->make(RetryManager::class),
                $app->make(DictionaryAdapter::class),
                $app->make(CacheManager::class)
            );
        });

        // CATALOG LAYER
        $this->app->singleton(PaginationManager::class, function ($app) {
            return new PaginationManager();
        });

        $this->app->singleton(CatalogService::class, function ($app) {
            return new CatalogService(
                $app->make(ObjectTypeResolver::class),
                $app->make(EndpointBuilder::class),
                $app->make(FilterBuilder::class),
                $app->make(HttpClient::class),
                $app->make(RetryManager::class),
                $app->make(ResponseNormalizer::class),
                $app->make(PaginationManager::class),
                $app->make(EntityNormalizer::class)
            );
        });

        // DETAIL LAYER
        $this->app->singleton(DetailAggregator::class, function ($app) {
            $aggregator = new DetailAggregator(
                $app->make(ParallelExecutor::class),
                $app->make(ResponseNormalizer::class)
            );

            // Регистрация стратегий
            $aggregator->registerStrategy(
                new BlockDetailStrategy($app->make(EndpointBuilder::class))
            );

            return $aggregator;
        });

        $this->app->singleton(SlugResolver::class, function ($app) {
            return new SlugResolver(
                $app->make(CatalogService::class),
                $app->make(CacheManager::class)
            );
        });

        $this->app->singleton(DetailService::class, function ($app) {
            return new DetailService(
                $app->make(ObjectTypeResolver::class),
                $app->make(EndpointBuilder::class),
                $app->make(HttpClient::class),
                $app->make(RetryManager::class),
                $app->make(ResponseNormalizer::class),
                $app->make(DetailAggregator::class),
                $app->make(SlugResolver::class),
                $app->make(EntityNormalizer::class)
            );
        });

        // MEDIA LAYER
        $this->app->singleton(MediaService::class, function ($app) {
            return new MediaService(
                $app->make(EndpointBuilder::class),
                $app->make(HttpClient::class),
                $app->make(RetryManager::class),
                $app->make(ResponseNormalizer::class)
            );
        });
    }

    /**
     * Bootstrap services
     */
    public function boot(): void
    {
        // Публикация конфигурации
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../../config/trendagent.php' => config_path('trendagent.php'),
            ], 'trendagent-config');
        }
    }

    /**
     * Get the services provided by the provider
     */
    public function provides(): array
    {
        return [
            // Auth
            AuthTokenManager::class,
            
            // HTTP
            HttpClient::class,
            RetryManager::class,
            ResponseNormalizer::class,
            ParallelExecutor::class,
            
            // Router
            ObjectTypeResolver::class,
            EndpointBuilder::class,
            
            // Entity
            EntityNormalizer::class,
            
            // Filters
            FilterRegistry::class,
            FilterBuilder::class,
            
            // Dictionaries
            CacheManager::class,
            DictionaryAdapter::class,
            DictionaryService::class,
            
            // Catalog
            PaginationManager::class,
            CatalogService::class,
            
            // Detail
            DetailAggregator::class,
            SlugResolver::class,
            DetailService::class,
            
            // Media
            MediaService::class,
        ];
    }
}
