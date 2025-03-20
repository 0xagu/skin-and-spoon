<?php

namespace App\Services;
use App\Models\{
    Item,
    ItemCategory,
    User
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
        $filter = $request->query('filter', 'All');
        $userId = Auth::id();

        $startOfWeek = Carbon::now()->setISODate($year, $weekNumber)->startOfWeek(Carbon::SUNDAY);
        $endOfWeek = Carbon::now()->setISODate($year, $weekNumber)->endOfWeek(Carbon::SATURDAY);
        $today = Carbon::today();

        $query = Item::where(function ($q) use ($userId) {
            $q->where('user_id', $userId)
              ->orWhereHas('itemCategory', function ($q) use ($userId) {
                  $q->whereRaw("member_id REGEXP ?", ["(^|\\|)$userId(\\||$)"]);
              });
        })
        ->where('status', '!=', 9)
        ->with('itemCategory');

        if ($filter === 'Starred') {
            $query->where('priority', 1);
            if ($weekNumber == 0) { 
                $query->whereYear('expiration_date', $year);
            } else { 
                $query->whereBetween('expiration_date', [$startOfWeek, $endOfWeek]);
            }
        } elseif ($filter === 'Expired') {
            $query->where('expiration_date', '<', $today); // Expired items
            if ($weekNumber == 0) { 
                $query->whereYear('expiration_date', $year);
            } else {
                $query->whereBetween('expiration_date', [$startOfWeek, $endOfWeek]);
            }
        } else {
            if ($weekNumber == 0) { 
                $query->whereYear('expiration_date', $year); 
            } else {
                $query->whereBetween('expiration_date', [$startOfWeek, $endOfWeek]);
            }
        }

        $items = $query->get();

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
        $userId = Auth::id();

        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'acquire_date.required' => 'Acquire date is required.',
            'acquire_date' => 'nullable|date|before:expiration_date',
            'expiration_date.required' => 'Expiration date is required.',
            'expiration_date' => 'nullable|date|after:acquire_date',
        ], [
            'name.required' => 'The name field is required.',
            'acquire_date.before' => 'Acquire date must be before the expiration date.',
            'expiration_date.after' => 'Expiration date must be after the acquire date.',
        ]);

        $category = ItemCategory::where('uuid', $request['category'])->first();

        Item::create([
            'user_id' => $userId,
            'name' => $request['name'],
            'notification' => $request['notification'] === true ? 1 : 0,
            'priority' => $request['priority'] === true ? 1 : 0,
            'item_category_id' => $category->id,
            'quantity' => $request['quantity'],
            'unit' => $request['unit'],
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
    public static function getListDate($request) {
        $filter = $request->query('filter');
        $userId = Auth::id();

        $query = Item::select('expiration_date')
                    ->whereNotNull('expiration_date')
                    ->where(function ($q) use ($userId) {
                        $q->where('user_id', $userId)
                          ->orWhereHas('itemCategory', function ($q) use ($userId) {
                              $q->whereRaw("member_id REGEXP ?", ["(^|\\|)$userId(\\||$)"]);
                          });
                    })
                    ->where('status', '!=', 9)
                    ->with('itemCategory');

        $today = Carbon::today();
    
        if ($filter === 'Expired') {
            $query->where('expiration_date', '<', $today);
        } elseif ($filter === 'Starred') {
            $query->where('priority', 1);
        }
    
        $items = $query->get();
        $availableWeeks = [];
    
        foreach ($items as $item) {
            $expirationDate = Carbon::parse($item->expiration_date);
            $year = $expirationDate->year;
            $week = $expirationDate->weekOfYear;
    
            if (!isset($availableWeeks[$year])) {
                $availableWeeks[$year] = ['0']; // 0 = all
            }
    
            if (!in_array($week, $availableWeeks[$year])) {
                $availableWeeks[$year][] = $week;
            }
        }
    
        // Sort weeks but keep "0" (all) at the start
        foreach ($availableWeeks as &$weeks) {
            usort($weeks, function ($a, $b) {
                return ($a == '0') ? -1 : (($b == '0') ? 1 : $a - $b);
            });
        }
    
        return $availableWeeks;
    }
    
    public static function getExpiryMetric() {
        dd("getExpiryMetric");
    }
    public static function getWasteMetric() {
        dd("getWasteMetric");
    }
    public static function addMemberToCategory($request) {
        $validatedData = $request->validate([
            'category_id' => 'required|exists:item_categories,uuid',
            'member_emails' => 'array',
        ]);

        try {
            // Begin Transaction
            \DB::beginTransaction();
    
            // Convert emails to user IDs
            $memberIds = User::whereIn('email', $validatedData['member_emails'])->pluck('id')->toArray();

            if (empty($memberIds)) {
                return response()->json([
                    'message' => 'No valid members found.',
                    'error' => 1
                ], 400);
            }
    
            $memberIdsString = implode('|', $memberIds);
    
            $category = ItemCategory::where('uuid', $validatedData['category_id'])->firstOrFail();
            $category->member_id = $memberIdsString;
            $category->save();

            \DB::commit();
    
            return response()->json([
                'message' => 'Members added to category successfully!',
                'error' => 0
            ], 200);
        } catch (\Exception $e) {
            \DB::rollBack();
    
            return response()->json([
                'message' => 'Failed to add members to category!',
                'error' => 1,
                'details' => $e->getMessage()
            ], 500);
        }
    }
    public static function getAllCategoryList($request) {
        $userId = Auth::id();
        $categories = ItemCategory::select('uuid','name')
                        ->whereRaw("member_id REGEXP ?", ["(^|\\|)".$userId."(\\||$)"])
                        ->where('status', '!=', 9)
                        ->get()
                        ->makeHidden(['members', 'encrypted_id']);

        return $categories;
    }
}
?>