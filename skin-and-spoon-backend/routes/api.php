<?php
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

Route::group([
    'as' => 'passport.',
    'prefix' => config('passport.path', 'oauth'),
], function () {
    Route::post('login', [AuthController::class, 'login'])->name('login');
});


Route::group([
    'prefix' => 'auth',
], function () {
    Route::post('welcome', [AuthController::class, 'loginOrRegister'])->name('welcome');
    // Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::get('verify-email/{token}', [AuthController::class, 'verifyEmail'])->name('verify.email');
    Route::post('verifyEmail', [AuthController::class, 'sendVerificationEmail'])->name('sendVerificationEmail');
});


Route::middleware('auth:api')->group(function () {
    Route::group([
        'prefix' => 'list'
    ], function () {
        Route::get('get', [ItemController::class, 'get']);
    }); 
});
?>