<?php

namespace App\Http\Controllers;
use App\Services\ShoppingService;
use Illuminate\Http\Request;

class ShoppingController extends Controller
{
    public function getShoppingList(Request $request)
    {
        return ShoppingService::getShoppingList($request);
    }
    public function createShoppingList(Request $request)
    {
        return ShoppingService::createShoppingList($request);
    }
    public function deleteShoppingList(Request $request)
    {
        return ShoppingService::deleteShoppingList($request);
    }
    public function getShoppingItemById(Request $request)
    {
        return ShoppingService::getShoppingItemById($request);
    }
    public function createShoppingItem(Request $request)
    {
        return ShoppingService::createShoppingItem($request);
    }
    public function deleteShoppingItemById(Request $request)
    {
        return ShoppingService::deleteShoppingItemById($request);
    }
    public function updateShoppingItemById(Request $request)
    {
        return ShoppingService::updateShoppingItemById($request);
    }
}
