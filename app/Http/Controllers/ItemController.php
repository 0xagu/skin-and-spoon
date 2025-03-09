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
    public function updateFavourite(Request $request)
    {
        return ItemService::updateFavourite($request);
    }
    public function getListDate(Request $request)
    {
        return ItemService::getListDate($request);
    }
    public function getExpiryMetric(Request $request)
    {
        return ItemService::getExpiryMetric($request);
    }
    public function getWasteMetric(Request $request)
    {
        return ItemService::getWasteMetric($request);
    }
}
