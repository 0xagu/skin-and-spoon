<?php

namespace App\Services;
use App\Models\{
    Item
};
use Illuminate\Support\Facades\{
    Hash,
    Auth,
    Mail,
    Validator
};

class ItemService {
    public static function get($request)
    {
        dd("get item after auth ok");
    }
}

?>