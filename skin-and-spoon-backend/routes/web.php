<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

/** PUBLIC ROUTE */
Route::get('/', function () {
    abort(404);
});