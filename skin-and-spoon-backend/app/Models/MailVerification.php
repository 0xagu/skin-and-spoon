<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MailVerification extends Model
{
    use HasFactory;

    protected $table = 'mail_verifications';

    protected $fillable = [
        'email',
        'token',
        'expires_at',
        'status'
    ];

    protected $dates = [
        'expires_at',
        'created_at',
        'updated_at',
    ];
}
