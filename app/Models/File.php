<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'original_name',
        'size_bytes',
        'dimension',
        'file_type',
        'unique_filename',
        'real_location',
        'related_id',
        'related_column',
        'related_model',
        'status',
    ];
}