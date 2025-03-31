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
    public function createOrEdit(Request $request)
    {
        return ItemService::createOrEdit($request);
    }
    public function getDetail($id)
    {
        return ItemService::getDetail($id);
    }
    public function updateFavourite(Request $request)
    {
        return ItemService::updateFavourite($request);
    }
    public function updateNotification(Request $request)
    {
        return ItemService::updateNotification($request);
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
    public function addMemberToCategory(Request $request)
    {
        return ItemService::addMemberToCategory($request);
    }
    public function getAllCategoryList(Request $request)
    {
        return ItemService::getAllCategoryList($request);
    }
    public function getItemsByDay(Request $request)
    {
        return ItemService::getItemsByDay($request);
    }
    public function getWeekDaysItemsInfo(Request $request)
    {
        return ItemService::getWeekDaysItemsInfo($request);
    }
    public function getUsedUpCountsByToday(Request $request)
    {
        return ItemService::getUsedUpCountsByToday($request);
    }
    public function updateUsedQuantity(Request $request)
    {
        return ItemService::updateUsedQuantity($request);
    }
    public function deleteItem(Request $request)
    {
        return ItemService::deleteItem($request);
    }
}
