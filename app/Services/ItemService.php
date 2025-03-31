<?php

namespace App\Services;
use App\Models\{
    Item,
    ItemCategory,
    User,
    File,
    ItemImage
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
    public static function createOrEdit($request)
    {
        $userId = Auth::id();

        $request->validate([
            'id' => 'nullable|exists:items,uuid',
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'acquire_date.required' => 'Acquire date is required.',
            'acquire_date' => 'nullable|date|before:expiration_date',
            'expiration_date.required' => 'Expiration date is required.',
            'expiration_date' => 'nullable|date|after:acquire_date',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ], [
            'name.required' => 'The name field is required.',
            'acquire_date.before' => 'Acquire date must be before the expiration date.',
            'expiration_date.after' => 'Expiration date must be after the acquire date.',
        ]);

        $category = ItemCategory::where('uuid', $request->input('category'))->first();

        if ($request->input('id')) {
            // **UPDATE EXISTING ITEM**
            $item = Item::where('uuid', $request->input('id'))->firstOrFail();
            $item->update([
                'name' => $request->input('name'),
                'notification' => $request->input('notification') === true ? 1 : 0,
                'priority' => $request->input('priority') === true ? 1 : 0,
                'item_category_id' => $category->id,
                'quantity' => $request->input('quantity'),
                'unit' => $request->input('unit'),
                'acquire_date' => $request->input('acquire_date'),
                'expiration_date' => $request->input('expiration_date'),
            ]);
        } else {
            // **CREATE NEW ITEM**
            $item = Item::create([
                'uuid' => (string) \Str::uuid(),
                'user_id' => $userId,
                'name' => $request->input('name'),
                'notification' => $request->input('notification') === true ? 1 : 0,
                'priority' => $request->input('priority') === true ? 1 : 0,
                'item_category_id' => $category->id,
                'quantity' => $request->input('quantity'),
                'unit' => $request->input('unit'),
                'acquire_date' => $request->input('acquire_date'),
                'expiration_date' => $request->input('expiration_date'),
                'status' => 1
            ]);
        }

        // store images 
        $imageIds = [];
        if (!empty($request->input('images'))) {
            foreach ($request->input('images') as $index => $imagePath) {
                $file = File::where('real_location', $imagePath)->first();
    
                if ($file) {
                    $itemImageId = ItemImage::create([
                        'item_id' => $item->id,
                        'file_id' => $file->id,
                        'real_location' => $file->real_location, 
                        'order' => $index + 1,
                        'status' => 1,
                        'is_deleted' => 0,
                    ]);
                    $imageIds[] = $itemImageId->id;
                }
            }
        }

        if (!empty($imageIds)) {
            $item->update([
                'logo' => implode('|', $imageIds),
            ]);
        }
    
        return response()->json([
            'message' => 'Item update successfully!',
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
        $item = Item::where('uuid', $request->input('id'))->with('itemCategory')->first();
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
    public static function updateNotification ($request) {
        $item = Item::where('uuid', $request->input('id'))->with('itemCategory')->first();
        if ($item) {
            $item->notification = $item->notification == 0 ? 1 : 0;
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
        $selectedDay = $request->query('day');
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
    public static function getItemsByDay($request) {
        $year = $request->query('year');
        $week = $request->query('week');
        $day = $request->query('day'); // Expecting 'Mon', 'Tue', etc.
        $userId = Auth::id();
        $filter = json_decode($request->query('filter', '{}'), true);
        $categoryUuid = $filter['category'] ?? null;
        $searchTerm = $filter['searchTerm'] ?? null;

        $startOfWeek = Carbon::now()->setISODate($year, $week)->startOfWeek(); // Monday
        $selectedDate = clone $startOfWeek;

        $dayIndex = [
            'Mon' => 0, 'Tue' => 1, 'Wed' => 2,
            'Thu' => 3, 'Fri' => 4, 'Sat' => 5, 'Sun' => 6
        ];

        if (isset($dayIndex[$day])) {
            $selectedDate->addDays($dayIndex[$day]);
        } else {
            return response()->json(['error' => 'Invalid day'], 400);
        }

        $today = now()->toDateString(); 
        
        $itemsQuery = Item::select(
            'uuid', 
            'name', 
            'notification', 
            'logo', 
            'priority', 
            'item_category_id',
            'quantity',
            'unit',
            'used_quantity',
            'used_up_date',
            'acquire_date',
            'expiration_date'
        )
            ->whereDate('expiration_date', $selectedDate->toDateString())
            ->where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                ->orWhereHas('itemCategory', function ($q) use ($userId) {
                    $q->whereRaw("member_id REGEXP ?", ["(^|\\|)$userId(\\||$)"]);
                });
            })
            ->where('status', '!=', 9)
            ->with('itemCategory');

        // Apply category filter if provided
        if (!empty($categoryUuid)) {
            $catId = ItemCategory::where('uuid', $categoryUuid)->value('id');
            $itemsQuery->where('item_category_id', $catId);
        }

        // Apply search filter if provided
        if (!empty($searchTerm)) {
            $itemsQuery->where('name', 'LIKE', "%{$searchTerm}%");
        }

        $items = $itemsQuery->orderBy('created_at', 'desc')->get()
            ->map(function($item) use ($today) {
                // Calculate freshness (until expiration date)
                $freshness = Carbon::parse($today)->diffInDays($item->expiration_date, false);
                $item->freshness = $freshness;
                $item->left_over_quantity = max($item->quantity - $item->used_quantity, 0);

                // Calculate used percentage
                $item->used_percentage = $item->quantity > 0 
                    ? round(($item->used_quantity / $item->quantity) * 100, 2) 
                    : 0;

                return $item;
            });

        return response()->json([
            'date' => $selectedDate->toDateString(),
            'items' => $items,
            'hasItems' => !$items->isEmpty(),
        ]);
    }
    public static function getWeekDaysItemsInfo($request) {
        $year = $request->query('year', now()->year);
        $week = $request->query('week', now()->weekOfYear);

        // Get the start of the requested week (Monday)
        $startOfWeek = Carbon::now()->setISODate($year, $week)->startOfWeek(Carbon::MONDAY);


        // Generate days of the week
        $daysOfWeek = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i)->format('Y-m-d');
    
            // Check if any item expires on this date
            $hasExpiryItem = \DB::table('items')->whereDate('expiration_date', $date)->exists();
    
            $daysOfWeek[] = [
                'day' => $startOfWeek->copy()->addDays($i)->format('D'),
                'date' => $date,
                'hasExpiryItem' => $hasExpiryItem,
            ];
        }

        return response()->json([
            'startOfWeek' => $startOfWeek->format('Y-m-d'),
            'daysOfWeek' => $daysOfWeek,
        ]);
    }
    public static function getUsedUpCountsByToday($request) {
        $today = now()->toDateString();

        $requiredUsedUpCounts = Item::whereDate('used_up_date', $today)
                                ->with('itemCategory')
                                ->get()
                                ->groupBy('itemCategory.name')
                                ->map(fn ($items, $category) => [
                                    'category' => $category,
                                    'count' => $items->count()
                                ])
                                ->values(); // Convert associative array to normal array

        return response()->json($requiredUsedUpCounts);

    }
    public static function updateUsedQuantity($request) {
        $item = Item::where('uuid', $request->id)->first();

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        if ($item->used_quantity < $item->quantity) { 
            $item->used_quantity += 1;
            $item->used_up_date = now();
            $item->save();

            return response()->json(['error'=> 0, 'message' => 'Quantity updated']);
        }

        return response()->json(['message' => 'No more items left'], 400);
    }
    public static function deleteItem ($request) {
        $item = Item::where('uuid', $request->input('id'))->first();

        if ($item) {
            $item->status = 9;
            $item->save();

            return response()->json([
                'message' => 'Item deleted successfully!',
                'error' => 0
            ], 200);

        } else {

            return response()->json([
                'message' => 'Item not found',
                'error' => 1
            ], 200);
            
        }
    }
}
?>