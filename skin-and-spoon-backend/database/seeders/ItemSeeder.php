<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Item;
use App\Models\ItemCategory;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Item::create([
            'user_id' => 1,
            'name' => 'Milk',
            'priority' => 1,
            'item_category_id' => ItemCategory::where('name', 'Dairy')->first()->id,
            'quantity' => 10,
            'acquire_date' => now(),
            'expiration_date' => now()->addDays(7)
        ]);
        
        Item::create([
            'user_id' => 1,
            'name' => 'Almond Milk',
            'priority' => 1,
            'item_category_id' => ItemCategory::where('name', 'Non-Dairy')->first()->id,
            'quantity' => 5,
            'acquire_date' => now(),
            'expiration_date' => now()->addDays(10)
        ]);

        Item::create([
            'user_id' => 1,
            'name' => 'Chicken Breast',
            'priority' => 0,
            'item_category_id' => ItemCategory::where('name', 'Meat')->first()->id,
            'quantity' => 3,
            'acquire_date' => now(),
            'expiration_date' => now()->addDays(5)
        ]);
    }
}
