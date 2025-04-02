<?php

namespace App\Services;
use App\Models\{
    Item,
};
use Carbon\Carbon;
use Illuminate\Support\Facades\{
    Auth,
    Http
};
class ChatService {
    
    public static function askAI($request)
    {
        $request->validate([
            'item_id' => 'required|uuid',
            'message' => 'nullable|string',
            'message_code' => 'nullable|string',
        ]);

        $item = Item::where('uuid', $request->item_id)->first();

        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        $itemName = $item->name;
        $expirationDate = $item->expiration_date;
        $unusedQuantity = max(0, $item->quantity - $item->used_quantity);
        $userId = Auth::id();

        $otherIngredients = Item::with('itemCategory')
                                ->where('expiration_date', '>', now())
                                ->where('uuid', '!=', $request->item_uuid)
                                ->where(function ($q) use ($userId) {
                                    $q->whereIn('user_id', [$userId])
                                    ->orWhereHas('itemCategory', function ($q) use ($userId) {
                                        $q->whereRaw("CONCAT('|', member_id, '|') LIKE ?", ['%' . $userId . '%']);
                                    });
                                })
                                ->pluck('name')
                                ->toArray();

        $otherIngredientsList = !empty($otherIngredients) 
                                    ? implode(', ', $otherIngredients) 
                                    : 'No other ingredients available';

                                    if ($request->message_code === "first_message") {
                                        $prompt = "
                                            I have leftover {$itemName} (expires: {$expirationDate}, quantity: {$unusedQuantity}).
                                            Other ingredients I have: {$otherIngredientsList}
                                            
                                            Suggest 2-3 quick ways to use up {$itemName} before it expires. 
                                            Format your response with clear bullet points and short, direct descriptions.
                                            Keep suggestions brief and easy to scan - no long explanations needed.
                                        ";
                                    } else {
                                        $prompt = $request->message;
                                    }

        $openRouterUrl = env('OPENROUTER_URL', 'https://api.openrouter.ai/v1/chat/completions');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post($openRouterUrl, [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
            ]);

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to connect to OpenRouter'], 500);
            }

            $responseData = $response->json();

            return response()->json([
                'message' => $responseData['choices'][0]['message']['content'] ?? 'No response',
                'done' => true
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        // OLLAMA (TOO HEAVY)
        // $ollamaUrl = env('OLLAMA_HOST', 'http://localhost:11434') . '/api/generate';

        // try {
        //     $response = Http::timeout(30)->post($ollamaUrl, [
        //         'model' => env('OLLAMA_MODEL', 'mistral'),
        //         'prompt' => $prompt,
        //         'stream' => false
        //     ]);

        //     if ($response->failed()) {
        //         return response()->json(['error' => 'Failed to connect to Ollama'], 500);
        //     }

        //     $responseData = $response->json();

        //     return response()->json([
        //         'message' => $responseData['response'] ?? 'No response',
        //         'done' => $responseData['done'] ?? false
        //     ]);

        // } catch (\Exception $e) {
        //     return response()->json(['error' => $e->getMessage()], 500);
        // }

        // CHATGPT (EXPENSIVE)
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