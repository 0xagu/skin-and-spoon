<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemImage extends Model
{
    protected $table = 'item_images';

    protected $fillable = [
        'item_id',
        'file_id', 
        'real_location',
        'order', 
        'status',
        'is_deleted',
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
}
