<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SparePartController;
use App\Http\Controllers\UsageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Spare Parts routes
    Route::resource('spare-parts', SparePartController::class);
    
    // Usage routes
    Route::controller(UsageController::class)->prefix('usage')->name('usage.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{usage}', 'show')->name('show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
