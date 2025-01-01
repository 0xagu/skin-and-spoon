<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Add the ability to use Passport's API tokens
        Passport::tokensCan([
            'view' => 'View user data',
            'edit' => 'Edit user data',
        ]);
    }
}
