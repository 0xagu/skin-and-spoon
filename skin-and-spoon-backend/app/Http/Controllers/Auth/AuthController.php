<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AuthService;

class AuthController extends Controller
{
    public function loginOrRegister(Request $request)
    {
        return AuthService::loginOrRegister($request);
    }
    public function sendVerificationEmail(Request $email, $verificationToken)
    {
        return AuthService::sendVerificationEmail($email, $verificationToken);
    }
    public function verifyEmail($token)
    {
        return AuthService::verifyEmail($token);
    }
    public function register(Request $request)
    {
        return AuthService::register($request);
    }
    public function login(Request $request)
    {
        return AuthService::login($request);
    }
}
