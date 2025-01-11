<?php

namespace App\Services;
use App\Models\{
    Item
};
use Illuminate\Support\Facades\{
    Hash,
    Auth,
    Mail,
    Validator
};

class ItemService {
    public static function get($request)
    {
        $items = Item::where('user_id',18)
                    ->where('status','!=',9)
                    ->with('itemCategory')
                    ->get();

        $groupItems = $items->groupBy('item_category_id');
        
        return $groupItems->toArray();
    }
    public static function create($request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'acquire_date' => 'required|date|before:expiration_date',
            'expiration_date' => 'required|date|after:acquire_date',
        ], [
            'name.required' => 'The name field is required.',
            'quantity.required' => 'Please specify the quantity.',
            'quantity.integer' => 'Quantity must be a whole number.',
            'acquire_date.required' => 'Acquire date is required.',
            'acquire_date.before' => 'Acquire date must be before the expiration date.',
            'expiration_date.required' => 'Expiration date is required.',
            'expiration_date.after' => 'Expiration date must be after the acquire date.',
        ]);

        Item::create([
            'user_id' => $request['user_id'],
            'name' => $request['name'],
            'priority' => $request['priority'],
            'item_category_id' => $request['category'],
            'quantity' => $request['quantity'],
            'acquire_date' => $request['acquire_date'],
            'expiration_date' => $request['expiration_date'],
            'status' => 1
        ]);

        return response()->json([
            'message' => 'Post created successfully!',
            'error' => 0
        ], 200);
    }
}

?>