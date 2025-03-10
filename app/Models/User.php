<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\MailVerification;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'name',
        'email',
        'is_verified',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'id',
        'password',
        'remember_token', //remember me persistent cookie 
    ];

    protected $appends = [
        'encrypted_id'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getEncryptedIdAttribute() {
        return \Crypt::encryptString($this->id);
    }

    public function mailVerification()
    {
        return $this->belongsTo( MailVerification::class,'email' );
    }
    
    public function logAuth()
    {
        return $this->belongsTo( LogAuth::class,'user_id' );
    }

    public function categories() {
        return $this->hasMany(ItemCategory::class, 'user_id');
    }    
}
