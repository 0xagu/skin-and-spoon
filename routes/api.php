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


// Public route 
Route::group([
    'prefix' => 'list',
], function () {
    Route::post('create', [ItemController::class, 'create']);
    Route::get('get', [ItemController::class, 'get']);
    Route::get('detail/{id}', [ItemController::class, 'getDetail']);
    Route::post('update-favourite', [ItemController::class, 'updateFavourite']);
    Route::get('get-list-date', [ItemController::class, 'getListDate']);
});


Route::middleware('auth:api')->group(function () {
    Route::group([
        'prefix' => 'list'
    ], function () {
        // Route::get('get', [ItemController::class, 'get']);
        // Route::post('create', [ItemController::class, 'create']);
    }); 
});
?>