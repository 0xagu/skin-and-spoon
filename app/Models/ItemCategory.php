<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemCategory extends Model
{
    protected $table = 'item_categories';

    protected $fillable = [
        'uuid',
        'name', 
        'parent_id', 
        'user_id',
        'member_id',
        'arrangement',
    ];

    protected $hidden = [
        'id'
    ];
    
    protected $appends = [
        'encrypted_id',
        'members'
    ];
    
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function getMembersAttribute()
    {
        if (!$this->member_id) {
            return collect();
        }

        $memberIds = explode('|', $this->member_id);
        return User::whereIn('id', $memberIds)->get(['uuid', 'name', 'email']);
    }

    public function getEncryptedIdAttribute() {
        return \Crypt::encryptString($this->id);
    }
}