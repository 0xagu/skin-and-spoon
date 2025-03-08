<?php

namespace App\Services;
use App\Models\{
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

        $shoppingItem = ShoppingItem::create([
            'uuid' => (string) Str::uuid(),
            'id' => $shoppingList->id,
            'name' => $request->name,
            'shopping_list_id' => $shoppingList->id,
            'quantity' => $request->quantity ?? 1,
            'priority' => $request->priority ?? 0,
            'order' => $newOrder,
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
            'id' => 'required|exists:shopping_items,uuid',
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'priority' => 'required|integer|min:0',
            'order' => 'required|integer|min:1',
        ]);

        $shoppingItem = ShoppingItem::where('uuid', $request->id)->firstOrFail();
        $shoppingListId = $shoppingItem->shopping_list_id;
        $currentOrder = $shoppingItem->order;
        $newOrder = $request->order;

        if ($newOrder !== $currentOrder) {
            $swapItem = ShoppingItem::where('shopping_list_id', $shoppingListId)
                ->where('order', $newOrder)
                ->first();
    
            if ($swapItem) {
                $swapItem->update(['order' => $currentOrder]);
            }
    
            $shoppingItem->order = $newOrder;
        }

        $shoppingItem->name = $request->name;
        $shoppingItem->quantity = $request->quantity;

        $shoppingItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Shopping item updated successfully'
        ]);
    }
}