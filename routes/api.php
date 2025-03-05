<?php
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;


Route::group([
    'prefix' => 'auth',
], function () {
    Route::post('welcome', [AuthController::class, 'loginOrRegister'])->name('welcome');
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::get('verify-email/{token}', [AuthController::class, 'verifyEmail'])->name('verify.email');
    Route::post('verifyEmail', [AuthController::class, 'sendVerificationEmail'])->name('sendVerificationEmail');
});

Route::get('/ping', fn() => response()->json(['message' => 'API is alive!']));

// Public route 
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('list')->group(function () {
        Route::post('create', [ItemController::class, 'create']);
        Route::get('get', [ItemController::class, 'get']);
        Route::get('detail/{id}', [ItemController::class, 'getDetail']);
        Route::post('update-favourite', [ItemController::class, 'updateFavourite']);
        Route::get('get-list-date', [ItemController::class, 'getListDate']);
    });

    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return response()->json($request->user());
    });
});
?>