<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\User;

class MailVerification extends Model
{
    use HasFactory;

    protected $table = 'mail_verifications';

    protected $fillable = [
        'email',
        'is_verified',
        'email_verification_at',
        'token',
        'expires_at',
        'status'
    ];

    protected $dates = [
        'expires_at',
        'created_at',
        'updated_at',
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

    public function user() {
        return $this->belongsTo( User::class, 'email' );
    }
}
