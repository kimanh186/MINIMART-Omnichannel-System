<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreInfo;

class StoreInfoController extends Controller
{
    public function show()
    {
        $storeInfo = StoreInfo::first();

        return response()->json([
            'success' => true,
            'data' => $storeInfo,
        ]);
    }
}