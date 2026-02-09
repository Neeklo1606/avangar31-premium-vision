@extends('admin.layout')

@section('title', 'ЖК (Комплексы) - TrendAgent Admin')
@section('page-title', 'ЖК (Жилые комплексы)')
@section('page-subtitle', 'Всего найдено: ' . number_format($total))

@section('content')
<div class="bg-white rounded-lg shadow">
    <!-- Фильтры -->
    <div class="p-6 border-b border-gray-200">
        <form method="GET" action="{{ route('admin.blocks.index') }}" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Поиск -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
                    <input type="text" name="search" value="{{ $filters['search'] ?? '' }}" 
                           placeholder="Название ЖК..."
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                
                <!-- Класс -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Класс</label>
                    <select name="class" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Все</option>
                        @if(isset($dictionaries['class']))
                            @foreach($dictionaries['class'] as $item)
                                <option value="{{ $item['value'] ?? $item['id'] }}" 
                                        {{ ($filters['class'] ?? '') == ($item['value'] ?? $item['id']) ? 'selected' : '' }}>
                                    {{ $item['label'] ?? $item['name'] }}
                                </option>
                            @endforeach
                        @endif
                    </select>
                </div>
                
                <!-- Цена от -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Цена от (₽)</label>
                    <input type="number" name="price_from" value="{{ $filters['price_from'] ?? '' }}" 
                           placeholder="От..."
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                
                <!-- Цена до -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Цена до (₽)</label>
                    <input type="number" name="price_to" value="{{ $filters['price_to'] ?? '' }}" 
                           placeholder="До..."
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
            </div>
            
            <div class="flex justify-end space-x-2">
                <a href="{{ route('admin.blocks.index') }}" 
                   class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Сбросить
                </a>
                <button type="submit" 
                        class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Применить
                </button>
            </div>
        </form>
    </div>
    
    <!-- Список ЖК -->
    <div class="divide-y divide-gray-200">
        @forelse($items as $block)
            <div class="p-6 hover:bg-gray-50 transition">
                <div class="flex items-start space-x-4">
                    <!-- Image -->
                    <div class="flex-shrink-0 w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        @if($block->mainImage)
                            <img src="{{ $block->mainImage }}" alt="{{ $block->name }}" class="w-full h-full object-cover">
                        @else
                            <div class="w-full h-full flex items-center justify-center text-gray-400">
                                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        @endif
                    </div>
                    
                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                    <a href="{{ route('admin.blocks.show', $block->id) }}">
                                        {{ $block->name }}
                                    </a>
                                </h3>
                                
                                @if($block->location?->address)
                                    <p class="text-sm text-gray-500 mt-1">
                                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        {{ $block->location->address }}
                                    </p>
                                @endif
                                
                                @if($block->shortDescription)
                                    <p class="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {{ $block->shortDescription }}
                                    </p>
                                @endif
                            </div>
                            
                            <div class="text-right ml-4">
                                @if($block->priceFrom)
                                    <p class="text-sm text-gray-500">от</p>
                                    <p class="text-xl font-bold text-gray-900">
                                        {{ number_format($block->priceFrom->value, 0, ',', ' ') }} ₽
                                    </p>
                                @endif
                            </div>
                        </div>
                        
                        <!-- Stats -->
                        <div class="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                            @if($block->class)
                                <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                                    {{ $block->class }}
                                </span>
                            @endif
                            
                            @if($block->status)
                                <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full">
                                    {{ $block->status }}
                                </span>
                            @endif
                            
                            @php
                                $stats = $block->getStats();
                            @endphp
                            
                            @if($stats['total_apartments'] ?? 0)
                                <span>
                                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                    Квартир: {{ $stats['total_apartments'] }}
                                </span>
                            @endif
                            
                            @if($stats['total_buildings'] ?? 0)
                                <span>
                                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                    Корпусов: {{ $stats['total_buildings'] }}
                                </span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <div class="p-12 text-center text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p class="text-lg">ЖК не найдены</p>
                <p class="text-sm mt-2">Попробуйте изменить параметры фильтрации</p>
            </div>
        @endforelse
    </div>
    
    <!-- Pagination -->
    @if($pagination['total_pages'] ?? 0 > 1)
        <div class="p-6 border-t border-gray-200">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                    Показано {{ count($items) }} из {{ number_format($total) }}
                </div>
                
                <div class="flex space-x-2">
                    @if($pagination['page'] > 1)
                        <a href="{{ route('admin.blocks.index', array_merge(request()->query(), ['page' => $pagination['page'] - 1])) }}" 
                           class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            Назад
                        </a>
                    @endif
                    
                    <span class="px-4 py-2 text-gray-700">
                        Страница {{ $pagination['page'] }} из {{ $pagination['total_pages'] }}
                    </span>
                    
                    @if($pagination['page'] < $pagination['total_pages'])
                        <a href="{{ route('admin.blocks.index', array_merge(request()->query(), ['page' => $pagination['page'] + 1])) }}" 
                           class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Далее
                        </a>
                    @endif
                </div>
            </div>
        </div>
    @endif
</div>

@if(isset($error))
    <div class="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        {{ $error }}
    </div>
@endif
@endsection
