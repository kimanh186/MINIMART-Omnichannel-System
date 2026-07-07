<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $this->checkSuperAdmin($request);

        $banners = Banner::orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $banners,
        ]);
    }

    public function store(Request $request)
    {
        $this->checkSuperAdmin($request);

        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:5120',
            'sort_order' => 'nullable|integer|min:0',
            'active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request
                ->file('image')
                ->store('banners', 'public');
        }

        $data['sort_order'] =
            $request->sort_order ?? 0;

        $data['active'] =
            $request->boolean('active');

        $banner = Banner::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Thêm banner thành công',
            'data' => $banner,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->checkSuperAdmin($request);

        $banner = Banner::findOrFail($id);

        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'sort_order' => 'nullable|integer|min:0',
            'active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image) {
                Storage::disk('public')
                    ->delete($banner->image);
            }

            $data['image'] = $request
                ->file('image')
                ->store('banners', 'public');
        }

        if ($request->has('active')) {
            $data['active'] =
                $request->boolean('active');
        }

        $banner->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật banner thành công',
            'data' => $banner,
        ]);
    }

    public function destroy(
        Request $request,
        $id
    ) {
        $this->checkSuperAdmin($request);

        $banner = Banner::findOrFail($id);

        if ($banner->image) {
            Storage::disk('public')
                ->delete($banner->image);
        }

        $banner->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa banner thành công',
        ]);
    }
    private function checkSuperAdmin(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            abort(403, 'Bạn không có quyền quản lý banner.');
        }
    }
}
