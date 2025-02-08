<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use Inertia\Inertia;

/** PUBLIC ROUTE */
Route::get('/', function () {
    abort(404);
});

Route::get('/', function () {
    return inertia('Home');
});