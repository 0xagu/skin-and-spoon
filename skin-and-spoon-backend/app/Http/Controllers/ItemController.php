<?php

namespace App\Http\Controllers;
use App\Services\ItemService;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function get(Request $request)
    {
        return ItemService::get($request);
    }
    public function create(Request $request)
    {
        return ItemService::create($request);
    }
    public function getDetail($id)
    {
        return ItemService::getDetail($id);
    }
}
