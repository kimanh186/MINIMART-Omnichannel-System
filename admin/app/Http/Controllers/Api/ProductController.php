<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
{
    $query = Product::with([
        'category',
        'brand',
        'inventories'
    ]);

    // =========================
    // LỌC THEO CHI NHÁNH
    // =========================

    if ($request->filled('branch_id')) {
        $query->whereHas(
            'inventories',
            function ($q) use ($request) {
                $q->where(
                    'branch_id',
                    $request->branch_id
                )
                ->where(
                    'stock_quantity',
                    '>',
                    0
                );
            }
        );
    }

    // =========================
    // TÌM KIẾM
    // =========================

    if ($request->filled('keyword')) {
        $query->where(
            'name',
            'like',
            '%' . $request->keyword . '%'
        );
    }

    // =========================
    // LỌC DANH MỤC
    // =========================

    if ($request->filled('category')) {
        $query->whereHas(
            'category',
            function ($q) use ($request) {
                $q->where(
                    'name',
                    $request->category
                );
            }
        );
    }

    // =========================
    // LỌC THƯƠNG HIỆU
    // =========================

    if ($request->filled('brand')) {
        $query->whereHas(
            'brand',
            function ($q) use ($request) {
                $q->where(
                    'name',
                    'like',
                    '%' . $request->brand . '%'
                );
            }
        );
    }

    // =========================
    // GIÁ TỪ
    // =========================

    if ($request->filled('min_price')) {
        $query->where(
            'price',
            '>=',
            $request->min_price
        );
    }

    // =========================
    // GIÁ ĐẾN
    // =========================

    if ($request->filled('max_price')) {
        $query->where(
            'price',
            '<=',
            $request->max_price
        );
    }

    // =========================
    // SẮP XẾP
    // =========================

    if ($request->sort === 'price-asc') {
        $query->orderBy(
            'price',
            'asc'
        );
    }

    if ($request->sort === 'price-desc') {
        $query->orderBy(
            'price',
            'desc'
        );
    }

    // =========================
    // LẤY TOÀN BỘ SẢN PHẨM
    // =========================

    $products = $query->get();

    return response()->json([
        'status' => true,

        'data' => $products->map(
            function ($p) use ($request) {

                $stock = 0;

                // CÓ CHỌN CHI NHÁNH
                if (
                    $request->filled(
                        'branch_id'
                    )
                ) {
                    $inventory = $p
                        ->inventories
                        ->where(
                            'branch_id',
                            $request->branch_id
                        )
                        ->first();

                    $stock =
                        $inventory?->stock_quantity
                        ?? 0;
                }

                // TẤT CẢ CHI NHÁNH
                else {
                    $stock = $p
                        ->inventories
                        ->sum(
                            'stock_quantity'
                        );
                }

                return [
                    'id' => $p->id,

                    'name' => $p->name,

                    'sku' => $p->sku,

                    'image' => $p->image,

                    'description' =>
                        $p->description,

                    'category' =>
                        $p->category,

                    'brand' =>
                        $p->brand,

                    'price' =>
                        $p->price,

                    'active' =>
                        $p->active,

                    'promotion' =>
                        $p->promotion,

                    'final_price' =>
                        $p->final_price,

                    'stock' =>
                        $stock,

                    'expiry_date' =>
                        $p->expiry_date,

                    'is_expired' =>
                        $p->is_expired,
                ];
            }
        ),
    ]);
}


    public function findBySku($sku)
    {
        $product = Product::with('category')->where('sku', $sku)->first();
        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $product
        ]);
    }


    public function show(Request $request, $id)
{
    $product = Product::with([
        'category',
        'brand',
        'inventories'
    ])->find($id);

    if (!$product) {
        return response()->json([
            'status' => false,
            'message' => 'Product not found'
        ], 404);
    }

    if ($request->filled('branch_id')) {
        $inventory = $product
            ->inventories
            ->where(
                'branch_id',
                $request->branch_id
            )
            ->first();

        $stock =
            $inventory?->stock_quantity
            ?? 0;
    } else {
        $stock = $product
            ->inventories
            ->sum('stock_quantity');
    }

    return response()->json([
        'status' => true,

        'data' => [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'image' => $product->image,
            'description' =>
                $product->description,
            'category' =>
                $product->category,
            'brand' =>
                $product->brand,
            'price' =>
                $product->price,
            'promotion' =>
                $product->promotion,
            'final_price' =>
                $product->final_price,
            'stock' => $stock,
            'expiry_date' =>
                $product->expiry_date,
            'is_expired' =>
                $product->is_expired,
        ],
    ]);
}

    public function reduceStock(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Product not found'], 404);
        }

        $qty = $request->quantity ?? 1;

        if ($product->stock < $qty) {
            return response()->json([
                'status' => false,
                'message' => 'Out of stock'
            ], 400);
        }

        $product->stock -= $qty;
        $product->save();

        $product->inventory()->update([
            'stock_quantity' => $product->stock,
            'status' => $product->stock > 0 ? 'in_stock' : 'out_of_stock',
            'updated_date' => now()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Stock updated',
            'data' => $product
        ]);
    }
    public function promotions(Request $request)
{
    $query = Product::with([
        'category',
        'brand',
        'inventories'
    ])
    ->where('promotion', '>', 0);

    // LỌC SẢN PHẨM THEO CHI NHÁNH
    if ($request->filled('branch_id')) {
        $query->whereHas(
            'inventories',
            function ($q) use ($request) {
                $q->where(
                    'branch_id',
                    $request->branch_id
                )
                ->where(
                    'stock_quantity',
                    '>',
                    0
                );
            }
        );
    }

    $products = $query->get();

return response()->json([
    'status' => true,

    'data' => $products->map(function ($p) use ($request) {

        $stock = 0;

        if ($request->filled('branch_id')) {
            $inventory = $p
                ->inventories
                ->where(
                    'branch_id',
                    $request->branch_id
                )
                ->first();

            $stock =
                $inventory?->stock_quantity
                ?? 0;
        } else {
            $stock = $p
                ->inventories
                ->sum('stock_quantity');
        }

        return [
            'id' => $p->id,
            'name' => $p->name,
            'sku' => $p->sku,
            'image' => $p->image,
            'description' => $p->description,
            'category' => $p->category,
            'brand' => $p->brand,
            'price' => $p->price,
            'active' => $p->active,
            'promotion' => $p->promotion,
            'final_price' => $p->final_price,
            'stock' => $stock,
            'expiry_date' => $p->expiry_date,
            'is_expired' => $p->is_expired,
        ];
    }),
]);
}


public function bestSelling(Request $request)
{
    $query = Product::with([
        'category',
        'brand',
        'inventories'
    ]);

    // LỌC SẢN PHẨM THEO CHI NHÁNH
    if ($request->filled('branch_id')) {
        $query->whereHas(
            'inventories',
            function ($q) use ($request) {
                $q->where(
                    'branch_id',
                    $request->branch_id
                )
                ->where(
                    'stock_quantity',
                    '>',
                    0
                );
            }
        );
    }

    $products = $query->get();

    return response()->json([
        'status' => true,

        'data' => $products->map(
            function ($p) use ($request) {

                $stock = 0;

                if (
                    $request->filled(
                        'branch_id'
                    )
                ) {
                    $inventory = $p
                        ->inventories
                        ->where(
                            'branch_id',
                            $request->branch_id
                        )
                        ->first();

                    $stock =
                        $inventory?->stock_quantity
                        ?? 0;
                } else {
                    $stock = $p
                        ->inventories
                        ->sum(
                            'stock_quantity'
                        );
                }

                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'sku' => $p->sku,
                    'image' => $p->image,
                    'category' => $p->category,
                    'brand' => $p->brand,
                    'price' => $p->price,
                    'promotion' => $p->promotion,
                    'final_price' => $p->final_price,
                    'stock' => $stock,
                ];
            }
        ),
    ]);
}
}
