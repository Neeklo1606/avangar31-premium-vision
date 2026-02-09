<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\BlocksController;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Маршруты для админ-панели TrendAgent
|
*/

Route::prefix('admin')->name('admin.')->group(function () {
    
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    // ЖК (Blocks)
    Route::prefix('blocks')->name('blocks.')->group(function () {
        Route::get('/', [BlocksController::class, 'index'])->name('index');
        Route::get('/{id}', [BlocksController::class, 'show'])->name('show');
    });
    
    // TODO: Добавить остальные контроллеры
    // Apartments, Parking, Houses, Plots, Commerce, Villages, HouseProjects
    
});
