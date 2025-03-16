<?php

namespace App\Http\Controllers;
use App\Services\ChatService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function askChatGpt(Request $request)
    {
        return ChatService::askChatGpt($request);
    }
}
