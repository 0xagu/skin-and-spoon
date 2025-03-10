<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MailTemplate extends Model
{
    use HasFactory;

    protected $table = 'mail_templates';
    
    protected $fillable = [
        'uuid',
        'name',
        'subject',
        'body',
        'status',
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
