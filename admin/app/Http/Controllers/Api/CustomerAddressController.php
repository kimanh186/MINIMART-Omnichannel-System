<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;

class CustomerAddressController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->addresses()
            ->orderByDesc('is_default')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required',
            'email' => 'nullable|email',
            'phone' => 'required',
            'address' => 'required',
            'city' => 'required',
            'district' => 'required',
            'ward' => 'required',
            'is_default' => 'boolean'
        ]);

        $data['user_id'] = $request->user()->id;

        if (($data['is_default'] ?? false) == true) {
            UserAddress::where(
                'user_id',
                $request->user()->id
            )->update([
                'is_default' => false
            ]);
        }

        $address = UserAddress::create($data);

        return response()->json($address, 201);
    }

    public function update(Request $request, $id)
    {
        $address = UserAddress::where(
            'user_id',
            $request->user()->id
        )->findOrFail($id);

        $data = $request->validate([
            'full_name' => 'required',
            'email' => 'nullable|email',
            'phone' => 'required',
            'address' => 'required',
            'city' => 'required',
            'district' => 'required',
            'ward' => 'required',
            'is_default' => 'boolean'
        ]);

        if (($data['is_default'] ?? false) == true) {
            UserAddress::where(
                'user_id',
                $request->user()->id
            )->update([
                'is_default' => false
            ]);
        }

        $address->update($data);

        return response()->json($address);
    }

    public function destroy(Request $request, $id)
    {
        $address = UserAddress::where(
            'user_id',
            $request->user()->id
        )->findOrFail($id);

        $address->delete();

        return response()->json([
            'message' => 'Đã xóa địa chỉ'
        ]);
    }
}