<?php

namespace App\Http\Controllers;
use App\Services\FileService;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function uploadFiles(Request $request)
    {
        return FileService::uploadFiles($request);
    }
}
