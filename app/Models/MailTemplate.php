<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MailTemplate extends Model
{
    use HasFactory;

    protected $table = 'mail_templates';
    
    protected $fillable = [
        'name',
        'subject',
        'body',
        'status',
    ];
}
