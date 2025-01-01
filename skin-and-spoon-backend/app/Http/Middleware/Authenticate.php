<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if ($request->is('login')) {
            return null;
        }

        if(request()->is('api/*'))
        {
            if (! $request->expectsJson()) {
                abort(response()->json('Missing Login Token', 403));
            }
        }else{
            return route('login');
        }
    }
}