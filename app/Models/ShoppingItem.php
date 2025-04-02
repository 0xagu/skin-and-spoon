<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingItem extends Model
{
    protected $table = 'shopping_items';

    protected $fillable = [
        'uuid',
        'shopping_list_id', 
        'name', 
        'quantity',
        'unit',
        'priority',
        'order',
        'latitude',
        'longitude',
        'shop_name',
        'remarks',
        'created_by',
        'assign_to',
        'status'
    ];

    protected $hidden = [
        'id'
    ];
    
    protected $appends = [
        'encrypted_id'
    ];

    public function getEncryptedIdAttribute() {
        return \Crypt::encryptString($this->id);
    }

    public function shoppingList()
    {
        return $this->belongsTo( ShoppingList::class, 'shopping_list_id' );
    }
}
