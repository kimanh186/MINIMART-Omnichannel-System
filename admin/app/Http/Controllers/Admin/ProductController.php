<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Tìm theo tên hoặc SKU
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%")
                    ->orWhere('sku', 'like', "%$keyword%");
            });
        }

        // Lọc theo hạn sử dụng
        if ($request->filled('expiry_date')) {
            $query->whereDate('expiry_date', '<=', $request->expiry_date);
        }

        $products = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return view('admin.product.index', compact('products'));
    }


    public function create()
    {
        $categories = Category::all();
        return view('admin.product.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'nullable|unique:products,sku',
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'import_price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'promotion' => 'nullable|numeric|min:0',
            'expiry_date' => 'nullable|date',
            'unit' => 'required|string|max:20',
            'image' => 'nullable|image|max:2048',
            'active' => 'nullable|boolean'
        ]);
        $validated['active'] = $request->has('active');


        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $validated['import_price'] = $request->input('import_price', 0);

        $product = Product::create($validated);

        Inventory::updateOrCreate(
            ['product_id' => $product->id],
            [
                'product_name'     => $product->name,
                'category'         => $product->category->name ?? null,
                'stock_quantity'   => $product->stock ?? 0,  // O
                'unit'           => $validated['unit'],
                'import_price'     => $product->import_price,
                'sale_price'       => $product->price,
                'status'         => (!$validated['active'] || ($product->stock ?? 0) <= 0) ? 'out_of_stock' : 'in_stock',
                'updated_date'     => now(),
            ]
        );


        return redirect()->route('product.index')->with('success', 'Thêm sản phẩm thành công');
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::all();
        return view('admin.product.edit', compact('product', 'categories'));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'sku' => 'required|string|max:50|unique:products,sku,' . $product->id,
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'brand' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'import_price' => 'required|numeric|min:0',
            'promotion' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'expiry_date' => 'nullable|date',
            'active' => 'nullable|boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        //  checkbox active
        $validated['active'] = $request->has('active'); // bắt checkbox
        $product->update($validated);

        //  xử lý ảnh
        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        //  update product
        $product->update($validated);

        //  đồng bộ Inventory
        Inventory::updateOrCreate(
            ['product_id' => $product->id],
            [
                'product_name'   => $product->name,
                'category'       => $product->category->name ?? null,
                'stock_quantity' => $product->stock,
                'stock_import'   => $product->stock,
                'unit'           => 'pcs',
                'import_price'   => $product->import_price,
                'sale_price'     => $product->price,
                'expired_date'   => $product->expiry_date, // ⭐ QUAN TRỌNG
                'status'         => (!$product->active || $product->stock <= 0) ? 'out_of_stock' : 'in_stock',
                'updated_date'   => now(),
            ]
        );

        return redirect()
            ->route('product.index')
            ->with('success', 'Cập nhật sản phẩm thành công!');
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('product.index')->with('success', 'Xóa sản phẩm thành công');
    }
}
