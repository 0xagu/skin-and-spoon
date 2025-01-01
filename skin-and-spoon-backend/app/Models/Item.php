<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = 'items';

    protected $fillable = [
        'user_id', 
        'name', 
        'priority', 
        'item_category_id', 
        'quantity', 
        'acquire_date', 
        'expiration_date'
    ];

    public function itemCategory()
    {
        return $this->belongsTo(ItemCategory::class, 'item_category_id');
    }
}
