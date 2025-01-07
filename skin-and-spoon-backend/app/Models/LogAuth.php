<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogAuth extends Model
{
    use HasFactory;

    protected $table = 'log_auths';

    protected $fillable = [
        'user_id', 
        'ip_address', 
        'user_agent', 
        'action'
    ];

    public function user() {
        return $this->belongsTo( User::class, 'email' );
    }
}
