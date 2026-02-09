<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| API маршруты для React SPA. Префикс /api применяется в bootstrap/app.php.
|
*/

// Публичные маршруты
Route::get('/', function () {
    return response()->json([
        'message' => 'Live Grid API v1',
        'docs' => '/api/',
    ]);
});

// Sanctum: регистрация, вход, восстановление пароля
Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/forgot-password', [App\Http\Controllers\Api\PasswordResetController::class, 'forgot']);
Route::post('/reset-password', [App\Http\Controllers\Api\PasswordResetController::class, 'reset']);

// Защищённые маршруты (требуют Bearer токен)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', [App\Http\Controllers\Api\AuthController::class, 'me']);

    // Маршруты с проверкой роли (пример)
    // Route::middleware('role:admin')->group(function () { ... });
});
