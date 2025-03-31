<?php

namespace App\Http\Controllers;
use App\Services\ChatService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function askAI(Request $request)
    {
        return ChatService::askAI($request);
    }
}
