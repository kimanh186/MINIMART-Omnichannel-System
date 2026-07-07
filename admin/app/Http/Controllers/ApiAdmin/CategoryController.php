<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index(Request $request)
{
    $keyword = $request->keyword;

    $categories = Category::when($keyword, function ($query) use ($keyword) {
        $query->where('name', 'like', "%{$keyword}%");
    })
    ->orderBy('id', 'desc')
    ->paginate(10);

    return response()->json([
        'success' => true,
        'data' => $categories->items(),
        'current_page' => $categories->currentPage(),
        'last_page' => $categories->lastPage(),
    ]);
}

    /**
     * POST /api/admin/categories
     */
    public function store(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            abort(403);
        }
        $validated = $request->validate([
    'name'  => 'required|string|max:255|unique:categories,name',
    'image' => 'nullable|image|max:2048',
], [
    'name.required' => 'Vui lòng nhập tên danh mục.',
    'name.unique' => 'Tên danh mục đã tồn tại.',
    'name.max' => 'Tên danh mục không được vượt quá 255 ký tự.',
    'image.image' => 'Ảnh phải là tệp hình ảnh.',
    'image.max' => 'Ảnh không được vượt quá 2MB.',
]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thêm danh mục thành công',
            'data' => $category
        ], 201);
    }

    /**
     * GET /api/admin/categories/{id}
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /**
     * PUT /api/admin/categories/{id}
     */
    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            abort(403);
        }

        $category = Category::findOrFail($id);

        $validated = $request->validate([
    'name'  => "sometimes|required|string|max:255|unique:categories,name,$id",
    'image' => 'nullable|image|max:2048',
], [
    'name.required' => 'Vui lòng nhập tên danh mục.',
    'name.unique' => 'Tên danh mục đã tồn tại.',
    'name.max' => 'Tên danh mục không được vượt quá 255 ký tự.',
    'image.image' => 'Ảnh phải là tệp hình ảnh.',
    'image.max' => 'Ảnh không được vượt quá 2MB.',
]);

        if ($request->hasFile('image')) {
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data' => $category
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            abort(403);
        }

        $category = Category::findOrFail($id);

        if (
            $category->image &&
            Storage::disk('public')->exists($category->image)
        ) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa danh mục thành công'
        ]);
    }
}
