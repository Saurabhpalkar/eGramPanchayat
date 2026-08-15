<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\user\CitizenDashboardController;     

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/auth/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/auth/resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
    Route::middleware('auth:sanctum')->group(function(){
        Route::get('/citizen/dashboard', [CitizenDashboardController::class, 'index']);
    });
});