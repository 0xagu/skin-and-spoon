<?php

namespace App\Services;
use App\Models\{
    ItemCategory,
    ShoppingList,
    ShoppingItem
};
use Illuminate\Support\Facades\{
    Hash,
    Auth,
    Mail,
    Validator
};
use Illuminate\Support\Str;
use Carbon\Carbon;
class ShoppingService {
    public static function getShoppingList($request)
    {
        $shoppingLists = ShoppingList::where('user_id', Auth::id())->with('items')->get();

        return response()->json([
            'success' => true,
            'data' => $shoppingLists
        ]);
    }
    public static function createShoppingList($request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }

        $shoppingList = ShoppingList::create([
            'uuid' => (string) Str::uuid(),
            'name' => $request->name,
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shopping list created successfully',
            'data' => $shoppingList
        ]);
    }
    public static function deleteShoppingList($request)
    {
        $shoppingList = ShoppingList::where('uuid', $request->shopping_list_id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$shoppingList) {
            return response()->json(['success' => false, 'message' => 'Shopping list not found'], 404);
        }

        $shoppingList->update(['status' => 9]);
        $shoppingList->shoppingList()->update(['status' => 9]);

        return response()->json([
            'success' => true,
            'message' => 'Shopping list deleted successfully'
        ]);
    }
    public static function getShoppingItemById ($request)
    {
        $userId = Auth::id();

        $shoppingLists = ShoppingList::where('user_id', $userId)
            ->with(['shoppingList' => function ($query) {
                $query->where('status', '!=', 9)
                  ->orderBy('order', 'asc');
            }])
            ->get();

        if ($shoppingLists->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No shopping lists found for this user'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $shoppingLists
        ]);
    }
    public static function createShoppingItem ($request)
    {
        $request->validate([
            'id' => 'required|exists:shopping_lists,uuid',
            'name' => 'required|string|max:255',
            'quantity' => 'integer|min:1',
            'priority' => 'integer|min:0'
        ]);

        $shoppingList = ShoppingList::where('uuid', $request->id)->firstOrFail();

        $maxOrder = ShoppingItem::where('shopping_list_id', $shoppingList->id)->max('order');
        $newOrder = ($maxOrder !== null) ? $maxOrder + 1 : 1;

        $userId = Auth::id();
        ShoppingItem::create([
            'uuid' => (string) Str::uuid(),
            'id' => $shoppingList->id,
            'name' => $request->name,
            'shopping_list_id' => $shoppingList->id,
            'quantity' => $request->quantity ?? 1,
            'priority' => $request->priority ?? 0,
            'order' => $newOrder,
            'created_by' => $userId,
            'status' => 1
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shopping item created successfully'
        ]);
    }
    public static function deleteShoppingItemById ($request)
    {
        $request->validate([
            'id' => 'required|exists:shopping_items,uuid',
        ]);

        $shoppingItem = ShoppingItem::where('uuid', $request->id)->firstOrFail();
        $deletedOrder = $shoppingItem->order;
        $shoppingListId = $shoppingItem->shopping_list_id;

        $shoppingItem->update([
            'status' => 9,
            'order' => 0
        ]);

        ShoppingItem::where('shopping_list_id', $shoppingListId)
            ->where('order', '>', $deletedOrder)
            ->orderBy('order')
            ->get()
            ->each(function ($item, $index) use ($deletedOrder) {
                $item->update(['order' => $deletedOrder + $index]);
        });


        return response()->json([
            'success' => true,
            'message' => 'Shopping item deleted successfully'
        ]);
    }
    public static function updateShoppingItemById($request)
    {
        $request->validate([
            'list_id' => 'nullable|exists:shopping_lists,uuid',
            'id' => 'nullable|exists:shopping_items,uuid',
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'priority' => 'nullable|integer|min:0',
            'order' => 'nullable|integer|min:1',
            'category_id' => 'nullable|string|max:255',
        ]);
    
        if ($request->list_id) {
            $shoppingList = ShoppingList::where('uuid', $request->list_id)->firstOrFail();
        } else {
            $category = ItemCategory::where('uuid', $request->category_id)->first();
            // create new if add from item list
            $shoppingList = ShoppingList::firstOrCreate(
                ['name' => $category->name], 
                ['uuid' => Str::uuid(),
                'user_id' => Auth::id(),
                'member_id' => Auth::id(),]
            );
        }
    
        // reorder item
        if ($request->id) {
            $shoppingItem = ShoppingItem::where('uuid', $request->id)
                                ->where('status', '!=', 9)
                                ->firstOrFail();
    
            $currentOrder = $shoppingItem->order;
            $newOrder = $request->order ?? $currentOrder;
    
            if ($newOrder !== $currentOrder) {
                $swapItem = ShoppingItem::where('shopping_list_id', $shoppingList->id)
                    ->where('order', $newOrder)
                    ->first();
    
                if ($swapItem) {
                    $swapItem->update(['order' => $currentOrder]);
                }
    
                $shoppingItem->order = $newOrder;
            }
    
            $shoppingItem->name = $request->name;
            $shoppingItem->quantity = $request->quantity;
            $shoppingItem->priority = $request->priority ?? $shoppingItem->priority;
            $shoppingItem->save();
    
            return response()->json([
                'error' => 0,
                'message' => 'Shopping item updated successfully'
            ]);
        } else {
            $existingItem = ShoppingItem::where('shopping_list_id', $shoppingList->id)
                ->where('name', $request->name)
                ->where('status', '!=', 9)
                ->first();
    
            if ($existingItem) {
                if ($existingItem->status == 1) {
                    $existingItem->quantity += $request->quantity;
                    $existingItem->save();
        
                    return response()->json([
                        'success' => true,
                        'message' => 'Item quantity updated successfully',
                        'data' => $existingItem
                    ]);
                }
                
                // If item was previously bought (status 2), reactivate it
                if ($existingItem->status == 2) {
                    // Find how many similar items exist
                    $similarCount = ShoppingItem::where('shopping_list_id', $shoppingList->id)
                        ->where('name', 'LIKE', $request->name . '%')
                        ->count();
    
                    $newItemName = $request->name . ' ' . ($similarCount + 1);
    
                    $shoppingItem = new ShoppingItem();
                    $shoppingItem->uuid = Str::uuid();
                    $shoppingItem->shopping_list_id = $shoppingList->id;
                    $shoppingItem->name = $newItemName;
                    $shoppingItem->quantity = $request->quantity;
                    $shoppingItem->priority = $request->priority ?? 0;
                    $shoppingItem->order = ShoppingItem::where('shopping_list_id', $shoppingList->id)->max('order') + 1;
                    $shoppingItem->status = 1; // Default status is active
    
                    $shoppingItem->save();
    
                    return response()->json([
                        'success' => true,
                        'message' => 'Item added with a new name',
                        'data' => $shoppingItem
                    ], 201);
                }
            } else {
                $shoppingItem = new ShoppingItem();
                $shoppingItem->uuid = Str::uuid();
                $shoppingItem->shopping_list_id = $shoppingList->id;
                $shoppingItem->name = $request->name;
                $shoppingItem->quantity = $request->quantity;
                $shoppingItem->priority = $request->priority ?? 0;
                $shoppingItem->order = ShoppingItem::where('shopping_list_id', $shoppingList->id)->max('order') + 1;
                $shoppingItem->status = 1;

                $shoppingItem->save();
    
                return response()->json([
                    'error' => 0,
                    'message' => 'Item added to shopping list',
                ], 201);
            }
        }
    }
    
}