<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/guest', [AuthController::class, 'guestSession']);
        
        // Protected routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });
    
    // Diagnosis routes
    Route::prefix('diagnosis')->group(function () {
        Route::post('/image', [DiagnosisController::class, 'analyzeImage']);
        Route::post('/symptoms', [DiagnosisController::class, 'analyzeSymptoms']);
        Route::post('/combined', [DiagnosisController::class, 'analyzeCombined']);
        
        // Protected routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/history', [DiagnosisController::class, 'getHistory']);
            Route::get('/{id}', [DiagnosisController::class, 'getDiagnosis']);
        });
    });
    
    // Doctor routes
    Route::prefix('doctors')->group(function () {
        Route::get('/search', [DoctorController::class, 'search']);
        Route::get('/{id}', [DoctorController::class, 'getDoctor']);
    });
    
    // Report routes
    Route::prefix('reports')->group(function () {
        Route::post('/generate', [ReportController::class, 'generatePDF']);
    });
    
    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'service' => 'Heal-Io Backend API',
            'version' => '1.0.0'
        ]);
    });
});
