<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{
    protected $table = 'shopping_lists';

    protected $fillable = [
        'uuid',
        'name', 
        'user_id', 
        'status',
    ];

    public function shoppingList()
    {
        return $this->hasMany(ShoppingItem::class);
    }
}
