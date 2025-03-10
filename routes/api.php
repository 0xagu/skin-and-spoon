<?php
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ShoppingController;
use Illuminate\Support\Facades\Route;


Route::group([
    'prefix' => 'auth',
], function () {
    // Route::post('welcome', [AuthController::class, 'loginOrRegister'])->name('welcome');
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
        Route::post('add-member', [ItemController::class, 'addMemberToCategory']);
    });

    Route::prefix('shopping')->group(function () {
        Route::get('', [ShoppingController::class, 'getShoppingList']);
        Route::post('', [ShoppingController::class, 'createShoppingList']);
        Route::post('/delete', [ShoppingController::class, 'deleteShoppingList']);

        Route::prefix('list')->group(function () {
            Route::get('', [ShoppingController::class, 'getShoppingItemById']); 
            Route::post('/create', [ShoppingController::class, 'createShoppingItem']);
            Route::post('/delete', [ShoppingController::class, 'deleteShoppingItemById']);
            Route::post('/update', [ShoppingController::class, 'updateShoppingItemById']);
        });
    });

    Route::prefix('analytic')->group(function () {
        Route::get('expiry', [ItemController::class, 'getExpiryMetric']);
        Route::get('waste', [ItemController::class, 'getWasteMetric']);
    });

    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return response()->json($request->user());
    });
});
?>