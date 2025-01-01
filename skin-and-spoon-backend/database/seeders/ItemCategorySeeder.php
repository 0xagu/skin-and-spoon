<?php

namespace Database\Seeders;
use App\Models\ItemCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ItemCategory::create([
            'name' => 'Milk',
            'parent_id' => null
        ]);
        ItemCategory::create([ 
            'name' => 'Dairy',
            'parent_id' => 1
        ]);
        ItemCategory::create([
            'name' => 'Non-Dairy',
            'parent_id' => 1
        ]);
        ItemCategory::create([
            'name' => 'Meat',
            'parent_id' => null
        ]);
        ItemCategory::create([
            'name' => 'Fruit',
            'parent_id' => null
        ]);
        ItemCategory::create([
            'name' => 'Vegetable',
            'parent_id' => null
        ]);
    }
}
