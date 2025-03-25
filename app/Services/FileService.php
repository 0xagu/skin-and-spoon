<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use App\Models\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\Request;

class FileService {
    public static function uploadFiles(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:5120',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $sizeBytes = $file->getSize();
            $fileType = $file->getMimeType();
            $uniqueFilename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $realLocation = 'items/' . $uniqueFilename;

            $dimension = null;
            if (str_starts_with($fileType, 'image')) {
                try {
                    $manager = new ImageManager(new Driver());
                    $image = $manager->read($file->getPathname());
                    $dimension = $image->width() . 'x' . $image->height();
                } catch (\Exception $e) {
                    \Log::error('Image processing error: ' . $e->getMessage());
                }
            }

            // upload to S3
            Storage::disk('s3')->put($realLocation, fopen($file->getRealPath(), 'r+'));

            // permanent file URL
            $fileUrl = Storage::disk('s3')->url($realLocation);

            $fileModel = File::create([
                'original_name' => $originalName,
                'size_bytes' => $sizeBytes,
                'dimension' => $dimension,
                'file_type' => $fileType,
                'unique_filename' => $uniqueFilename,
                'real_location' => $realLocation, // S3 path
            ]);

            $uploadedFiles[] = [
                'original_name' => $originalName,
                'file_url' => $fileUrl,
                'real_location' => $realLocation,
            ];
        }

        return response()->json([
            'error' => 0,
            'message' => 'Files uploaded successfully',
            'files' => $uploadedFiles,
        ]);
    }
}
