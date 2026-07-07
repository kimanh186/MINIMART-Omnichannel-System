<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    public function index(Request $request)
{
    $brands = Brand::query()

        ->when($request->keyword, function ($q, $keyword) {
            $q->where(
                'name',
                'like',
                "%{$keyword}%"
            );
        })

        ->latest()
        ->paginate(10);

    return response()->json([
        'success' => true,
        'data' => $brands->items(),
        'current_page' => $brands->currentPage(),
        'last_page' => $brands->lastPage(),
    ]);
}

    // Chi tiết
    public function show($id)
    {
        $brand = Brand::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $brand
        ]);
    }

    // Thêm
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
            'logo' => 'nullable|image|max:2048'
        ], [
            'name.required' => 'Vui lòng nhập tên thương hiệu.',
            'name.unique' => 'Tên thương hiệu đã tồn tại.',
            'name.max' => 'Tên thương hiệu không được vượt quá 255 ký tự.',
            'logo.image' => 'Logo phải là tệp hình ảnh.',
            'logo.max' => 'Logo không được vượt quá 2MB.',
        ]);

        if ($request->hasFile('logo')) {
            $data['logo'] = $request
                ->file('logo')
                ->store('brands', 'public');
        }

        $brand = Brand::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Thêm thương hiệu thành công',
            'data' => $brand
        ], 201);
    }

    // Cập nhật
    public function update(
        Request $request,
        $id
    ) {
        $brand = Brand::findOrFail($id);

        $data = $request->validate([
           'name' => "required|string|max:255|unique:brands,name,$id",
            'logo' => 'nullable|image|max:2048'
        ], [
            'name.required' => 'Vui lòng nhập tên thương hiệu.',
            'name.unique' => 'Tên thương hiệu đã tồn tại.',
            'name.max' => 'Tên thương hiệu không được vượt quá 255 ký tự.',
            'logo.image' => 'Logo phải là tệp hình ảnh.',
            'logo.max' => 'Logo không được vượt quá 2MB.',
        ]);

        if ($request->hasFile('logo')) {

            if ($brand->logo) {
                Storage::disk('public')
                    ->delete($brand->logo);
            }

            $data['logo'] = $request
                ->file('logo')
                ->store('brands', 'public');
        }

        $brand->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thành công',
            'data' => $brand
        ]);
    }

    // Xóa
    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        // Không cho xóa nếu đang có sản phẩm
        if (
            $brand->products()
            ->count() > 0
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                'Không thể xóa thương hiệu đang có sản phẩm'
            ], 422);
        }

        if ($brand->logo) {
            Storage::disk('public')
                ->delete($brand->logo);
        }

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa thành công'
        ]);
    }
}
