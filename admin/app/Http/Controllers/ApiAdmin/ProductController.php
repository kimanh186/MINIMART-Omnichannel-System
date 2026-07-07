<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category', 'brand');

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%")
                    ->orWhere('sku', 'like', "%$keyword%");
            });
        }
        if ($request->filled('category_id')) {
            $query->where(
                'category_id',
                $request->category_id
            );
        }
        if ($request->brand_id) {
            $query->where(
                'brand_id',
                $request->brand_id
            );
        }

        if ($request->filled('expiry_before')) {
            $query->whereDate('expiry_date', '<=', $request->expiry_before);
        }

        $products = $query->orderByDesc('created_at')->paginate(10);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return response()->json($product);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'nullable|unique:products,sku',
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'import_price' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'promotion' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'unit' => 'required|string|max:20',
            'expiry_date' => 'nullable|date',
            'active' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        // xử lý ảnh
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // checkbox active
        if (!isset($validated['active'])) {
            $validated['active'] = 0;
        }

        $product = Product::create($validated);

        Inventory::updateOrCreate(
            ['product_id' => $product->id],
            [
                'product_name' => $product->name,
                'stock_quantity' => $product->stock ?? 0,
                'sale_price' => $product->price,
                'status' => ($product->stock ?? 0) > 0 ? 'in_stock' : 'out_of_stock'
            ]
        );

        return response()->json([
            'message' => 'Thêm sản phẩm thành công',
            'data' => $product
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        // Validate dữ liệu
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|unique:products,sku,' . $id,
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'import_price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'promotion' => 'nullable|numeric|min:0',
            'expiry_date' => 'nullable|date',
            'active' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        // Xử lý file ảnh nếu có
        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        // Checkbox active: nếu không có trong request, set về 0
        if (!isset($validated['active'])) {
            $validated['active'] = 0;
        }

        $product->update($validated);

        // Cập nhật Inventory nếu stock hoặc price thay đổi
        Inventory::updateOrCreate(
            ['product_id' => $product->id],
            [
                'product_name' => $product->name,
                'stock_quantity' => $product->stock ?? 0,
                'sale_price' => $product->price,
                'status' => ($product->stock ?? 0) > 0 ? 'in_stock' : 'out_of_stock'
            ]
        );

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $product
        ]);
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }
}
