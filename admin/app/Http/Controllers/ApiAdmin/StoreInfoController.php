<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\StoreInfo;
use Illuminate\Http\Request;

class StoreInfoController extends Controller
{
    private function checkSuperAdmin(
        Request $request
    ) {
        if (
            $request->user()->role
            !== 'super_admin'
        ) {
            abort(
                403,
                'Bạn không có quyền quản lý thông tin cửa hàng.'
            );
        }
    }

    public function show(Request $request)
    {
        $this->checkSuperAdmin($request);

        $storeInfo = StoreInfo::first();

        return response()->json([
            'success' => true,
            'data' => $storeInfo,
        ]);
    }

    public function update(Request $request)
    {
        $this->checkSuperAdmin($request);

        $data = $request->validate([
            'store_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $storeInfo = StoreInfo::first();

        if (!$storeInfo) {
            $storeInfo = StoreInfo::create($data);
        } else {
            $storeInfo->update($data);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin cửa hàng thành công',
            'data' => $storeInfo,
        ]);
    }
}
