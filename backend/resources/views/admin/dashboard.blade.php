@extends('admin.layout')

@section('title', 'Dashboard - TrendAgent Admin')
@section('page-title', 'Dashboard')
@section('page-subtitle', 'Обзор статистики по всем объектам')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- ЖК -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">ЖК (Комплексы)</p>
                <p class="text-3xl font-bold text-gray-800">{{ number_format($stats['blocks'] ?? 0) }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
            </div>
        </div>
        <a href="{{ route('admin.blocks.index') }}" class="mt-4 text-sm text-blue-600 hover:text-blue-800">
            Смотреть все →
        </a>
    </div>
    
    <!-- Квартиры -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">Квартиры</p>
                <p class="text-3xl font-bold text-gray-800">{{ number_format($stats['apartments'] ?? 0) }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
            </div>
        </div>
        <a href="{{ route('admin.apartments.index') }}" class="mt-4 text-sm text-green-600 hover:text-green-800">
            Смотреть все →
        </a>
    </div>
    
    <!-- Паркинги -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">Паркинги</p>
                <p class="text-3xl font-bold text-gray-800">{{ number_format($stats['parking'] ?? 0) }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
            </div>
        </div>
        <a href="{{ route('admin.parking.index') }}" class="mt-4 text-sm text-purple-600 hover:text-purple-800">
            Смотреть все →
        </a>
    </div>
    
    <!-- Дома -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">Дома</p>
                <p class="text-3xl font-bold text-gray-800">{{ number_format($stats['houses'] ?? 0) }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
            </div>
        </div>
        <a href="{{ route('admin.houses.index') }}" class="mt-4 text-sm text-yellow-600 hover:text-yellow-800">
            Смотреть все →
        </a>
    </div>
    
    <!-- Участки -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">Участки</p>
                <p class="text-3xl font-bold text-gray-800">{{ number_format($stats['plots'] ?? 0) }}</p>
            </div>
            <div class="p-3 bg-indigo-100 rounded-full">
                <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
            </div>
        </div>
        <a href="{{ route('admin.plots.index') }}" class="mt-4 text-sm text-indigo-600 hover:text-indigo-800">
            Смотреть все →
        </a>
    </div>
    
    <!-- Коммерция -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">Коммерция</p>
                <p class="text-3xl font-bold text-gray-800">{{ number_format($stats['commerce'] ?? 0) }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
            </div>
        </div>
        <a href="{{ route('admin.commerce.index') }}" class="mt-4 text-sm text-red-600 hover:text-red-800">
            Смотреть все →
        </a>
    </div>
    
    <!-- Поселки -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">Поселки</p>
                <p class="text-3xl font-bold text-gray-800">{{ number_format($stats['villages'] ?? 0) }}</p>
            </div>
            <div class="p-3 bg-teal-100 rounded-full">
                <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </div>
        </div>
        <a href="{{ route('admin.villages.index') }}" class="mt-4 text-sm text-teal-600 hover:text-teal-800">
            Смотреть все →
        </a>
    </div>
    
    <!-- Проекты домов -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-gray-500">Проекты домов</p>
                <p class="text-3xl font-bold text-gray-800">{{ number_format($stats['house_projects'] ?? 0) }}</p>
            </div>
            <div class="p-3 bg-pink-100 rounded-full">
                <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            </div>
        </div>
        <a href="{{ route('admin.house-projects.index') }}" class="mt-4 text-sm text-pink-600 hover:text-pink-800">
            Смотреть все →
        </a>
    </div>
</div>

@if(isset($error))
    <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        {{ $error }}
    </div>
@endif
@endsection
