<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = 'items';

    protected $fillable = [
        'uuid',
        'user_id', 
        'name', 
        'priority', 
        'item_category_id', 
        'quantity', 
        'acquire_date', 
        'expiration_date'
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
    
    public function itemCategory()
    {
        return $this->belongsTo(ItemCategory::class, 'item_category_id');
    }
}
