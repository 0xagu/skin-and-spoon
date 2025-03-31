<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Item extends Model
{
    protected $table = 'items';

    protected $fillable = [
        'uuid',
        'user_id', 
        'name', 
        'notification',
        'logo',
        'priority', 
        'item_category_id', 
        'quantity', 
        'unit',
        'used_quantity',
        'used_up_date',
        'acquire_date', 
        'expiration_date',
        'status'
    ];

    protected $hidden = [
        'id'
    ];
    
    protected $appends = [
        'encrypted_id',
        'img_preview'
    ];

    public function getEncryptedIdAttribute() {
        return \Crypt::encryptString($this->id);
    }
    
    public function itemCategory()
    {
        return $this->belongsTo(ItemCategory::class, 'item_category_id');
    }
    public function getImgPreviewAttribute()
    {
        if (!$this->logo) {
            return [];
        }
    
        // Convert logo field (e.g., "12|13|14") into an array of IDs
        $imageIds = explode('|', $this->logo);
    
        // Fetch images from item_images and join with files table
        $images = ItemImage::whereIn('item_images.id', $imageIds)
            ->join('files', 'item_images.file_id', '=', 'files.id')
            ->orderBy('item_images.order')
            ->get(['files.real_location', 'files.file_type', 'files.size_bytes']);
    
        if ($images->isEmpty()) {
            return [];
        }
    
        $imageData = [];
    
        foreach ($images as $image) {
            $path = $image->real_location; // Fetch stored path from database
    
            if (Storage::disk('s3')->exists($path)) {
                $temporaryUrl = Storage::disk('s3')->temporaryUrl($path, Carbon::now()->addMinutes(60)); // 1-hour expiry
    
                $imageData[] = [
                    'name' => basename($path),
                    'format' => $image->file_type, // Updated field name
                    'size' => $image->size_bytes,  // Updated field name
                    'real_location' => $image->real_location, // Permanent URL (if public)
                    'temporary_url' => $temporaryUrl // Temporary URL for private access
                ];
            }
        }
    
        return $imageData;
    }
    
}
