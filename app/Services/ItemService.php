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

use Carbon\Carbon;
class ItemService {
    public static function get($request)
    {
        $year = $request->query('year', Carbon::now()->year);
        $weekNumber = $request->query('week', Carbon::now()->weekOfYear);

        $startOfWeek = Carbon::now()->setISODate($year, $weekNumber)->startOfWeek(Carbon::SUNDAY);
        $endOfWeek = Carbon::now()->setISODate($year, $weekNumber)->endOfWeek(Carbon::SATURDAY);

        $items = Item::where('user_id', 18)
                    ->where('status', '!=', 9)
                    ->whereBetween('expiration_date', [$startOfWeek, $endOfWeek])
                    ->with('itemCategory')
                    ->get();

        $groupedItems = $items->groupBy(function ($item) {
            return $item->itemCategory->name;
        });

        $result = $groupedItems->map(function ($group, $categoryName) {
            return [
                'category_name' => $categoryName,
                'items' => $group->map(function ($item) {
                    return $item;
                }),
            ];
        });
                
        return $result->values()->toArray();
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
    public static function getDetail($id)
    {
        $item = Item::where('id', $id)->with('itemCategory')->first();

        if (!$item) {
            return response()->json([
                'error' => 1,
                'message' => 'Item not found'
            ], 400);
        }

        return response()->json($item);
    }
    public static function updateFavourite ($request) {
        $item = Item::where('id', $request->input('id'))->with('itemCategory')->first();
        if ($item) {
            $item->priority = $item->priority == 0 ? 1 : 0;
            $item->save();
        } else {
            return response()->json([
                'message' => 'Item not found',
                'error' => 1
            ], 200);
        }
       
        return response()->json([
            'message' => 'Item updated successfully!',
            'error' => 0
        ], 200);
    }
    public static function getListDate() {
        $items = Item::select('expiration_date')
            ->whereNotNull('expiration_date')
            ->get();
    
        $availableWeeks = [];
    
        foreach ($items as $item) {
            $expirationDate = Carbon::parse($item->expiration_date);
    
            $year = $expirationDate->year;
            $week = $expirationDate->weekOfYear;
    
            if (!isset($availableWeeks[$year])) {
                $availableWeeks[$year] = [];
            }
    
            if (!in_array($week, $availableWeeks[$year])) {
                $availableWeeks[$year][] = $week;
            }
        }
    
        foreach ($availableWeeks as &$weeks) {
            sort($weeks);
        }
    
        return $availableWeeks;
    }
}

?>