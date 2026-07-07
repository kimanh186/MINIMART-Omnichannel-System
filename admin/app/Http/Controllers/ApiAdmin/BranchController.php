<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        return response()->json(
            Branch::where('active', 1)
                ->orderBy('id')
                ->get()
        );
    }
    // public function index(Request $request)
    // {
    //     $user = $request->user();

    //     $query = Branch::query();

    //     // Nếu là quản lý chi nhánh thì chỉ lấy chi nhánh của mình
    //     if ($user->role === 'branch_manager') {
    //         $query->where('id', $user->branch_id);
    //     }

    //     return response()->json(
    //         $query->orderBy('id')->get()
    //     );
    // }


    public function nearest(Request $request)
    {
        $lat = $request->latitude;
        $lng = $request->longitude;

        $branch = Branch::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select('*')
            ->selectRaw("
        (
            6371 *
            acos(
                cos(radians(?))
                *
                cos(radians(latitude))
                *
                cos(
                    radians(longitude)-radians(?)
                )
                +
                sin(radians(?))
                *
                sin(radians(latitude))
            )
        ) as distance
    ", [
                $lat,
                $lng,
                $lat
            ])
            ->where('active', 1)
            ->orderBy('distance')
            ->first();

        return response()->json($branch);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ], [
            'name.required' => 'Vui lòng nhập tên chi nhánh.',
            'name.max' => 'Tên chi nhánh không được vượt quá 255 ký tự.',
            'address.required' => 'Vui lòng nhập địa chỉ.',
            'address.max' => 'Địa chỉ không được vượt quá 500 ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',
        ]);

        $branch = Branch::create($data);

        return response()->json($branch, 201);
    }

    // Chi tiết
    public function show($id)
    {
        return response()->json(
            Branch::findOrFail($id)
        );
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'active' => 'boolean'
        ], [
            'name.required' => 'Vui lòng nhập tên chi nhánh.',
            'name.max' => 'Tên chi nhánh không được vượt quá 255 ký tự.',
            'address.required' => 'Vui lòng nhập địa chỉ.',
            'address.max' => 'Địa chỉ không được vượt quá 500 ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',
            'active.boolean' => 'Trạng thái không hợp lệ.',
        ]);

        $branch->update($data);

        return response()->json([
            'message' => 'Cập nhật thành công',
            'branch' => $branch
        ]);
    }

    // Khóa/Mở chi nhánh
    public function toggleStatus($id)
    {
        $branch = Branch::findOrFail($id);

        $branch->active = !$branch->active;

        $branch->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'active' => $branch->active
        ]);
    }

    // Xóa
    public function destroy($id)
    {
        Branch::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Xóa thành công'
        ]);
    }
}
