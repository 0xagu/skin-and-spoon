<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;

use Carbon\Carbon;
class ChatService {
    public static function askChatgpt($request)
    {

        // OLLAMA 
        $request->validate([
            'message' => 'required|string'
        ]);

        $ollamaUrl = env('OLLAMA_HOST', 'http://localhost:11434') . '/api/generate';

        try {
            $response = Http::timeout(30)->post($ollamaUrl, [
                'model' => env('OLLAMA_MODEL', 'mistral'),
                'prompt' => $request->input('message'),
                'stream' => false
            ]);

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to connect to Ollama'], 500);
            }

            $responseData = $response->json();

            return response()->json([
                'message' => $responseData['response'] ?? 'No response',
                'done' => $responseData['done'] ?? false
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        // CHATGPT 
        // $userMessage = $request->input('message');

        // // Validate input
        // if (!$userMessage) {
        //     return response()->json(['error' => 'Message is required'], 400);
        // }

        // // OpenAI API Request
        // $response = Http::withHeaders([
        //     'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
        //     'Content-Type' => 'application/json',
        // ])->post('https://api.openai.com/v1/chat/completions', [
        //     'model' => 'gpt-3.5-turbo',
        //     'messages' => [
        //         ['role' => 'system', 'content' => 'You are a helpful assistant.'],
        //         ['role' => 'user', 'content' => $userMessage]
        //     ],
        //     'temperature' => 0.7,
        // ]);

        // return response()->json($response->json());
    }
}