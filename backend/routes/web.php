<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Vue.js Admin SPA
Route::get('/admin{any}', function () {
    return view('admin');
})->where('any', '.*');

// API Routes for TrendAgent
require __DIR__.'/trendagent.php';
