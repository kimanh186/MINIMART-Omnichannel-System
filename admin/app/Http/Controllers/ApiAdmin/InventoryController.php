<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Inventory::with([
            'product.category',
            'branch'
        ]);
        if (
            $user->role === 'branch_manager'
        ) {
            $query->where(
                'branch_id',
                $user->branch_id
            );
        }

        if ($request->filled('keyword')) {
            $kw = $request->keyword;
            $query->whereHas('product', function ($q) use ($kw) {
                $q->where('name', 'like', "%$kw%")
                    ->orWhere('sku', 'like', "%$kw%");
            });
        }
        if ($user->role === 'super_admin') {
            if ($request->filled('branch_id')) {
                $query->where(
                    'branch_id',
                    $request->branch_id
                );
            }
        }

        if ($request->filled('expired_date')) {
            $query->whereDate('expired_date', '<=', $request->expired_date);
        }

        $inventories = $query
            ->orderBy('updated_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $inventories->items(),
            'current_page' => $inventories->currentPage(),
            'last_page' => $inventories->lastPage(),
        ]);
    }

    public function show($id)
    {
        return response()->json(
            Inventory::with([
                'product.category',
                'branch'
            ])->findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id'   => 'required|exists:products,id',
            'branch_id'    => 'required|exists:branches,id',
            'add_quantity' => 'required|integer|min:0',
            'import_price' => 'nullable|numeric',
            'sale_price'   => 'nullable|numeric',
            'unit'         => 'nullable|string|max:50',
            'expired_date' => 'nullable|date',
        ], [
            'product_id.required' => 'Vui lòng chọn sản phẩm.',
            'product_id.exists' => 'Sản phẩm không tồn tại.',

            'branch_id.required' => 'Vui lòng chọn chi nhánh.',
            'branch_id.exists' => 'Chi nhánh không tồn tại.',

            'add_quantity.required' => 'Vui lòng nhập số lượng.',
            'add_quantity.integer' => 'Số lượng phải là số nguyên.',
            'add_quantity.min' => 'Số lượng không được nhỏ hơn 0.',

            'import_price.numeric' => 'Giá nhập phải là số.',
            'sale_price.numeric' => 'Giá bán phải là số.',

            'unit.max' => 'Đơn vị tính không được vượt quá 50 ký tự.',

            'expired_date.date' => 'Ngày hết hạn không hợp lệ.',
        ]);

        $inventory = Inventory::where(
            'product_id',
            $request->product_id
        )
            ->where(
                'branch_id',
                $request->branch_id
            )
            ->first();

        $currentStock = $inventory?->stock_quantity ?? 0;
        $newStock = $currentStock + $request->add_quantity;

        $inventory = Inventory::updateOrCreate(
            [
                'product_id' => $request->product_id,
                'branch_id'  => $request->branch_id,
            ],
            [
                'stock_quantity' => $newStock,
                'unit'           => $request->unit,
                'import_price'   => $request->import_price,
                'sale_price'     => $request->sale_price,
                'expired_date'   => $request->expired_date,
                'updated_at'     => now(),
                'status' => $newStock == 0
                    ? 'out_of_stock'
                    : ($newStock <= 10 ? 'low_stock' : 'in_stock'),
            ]
        );

        $totalStock = Inventory::where(
            'product_id',
            $request->product_id
        )->sum('stock_quantity');

        Product::where(
            'id',
            $request->product_id
        )->update([
            'stock' => $totalStock
        ]);

        return response()->json([
            'message' => 'Nhập thêm tồn kho thành công',
            'stock_quantity' => $newStock
        ]);
    }


    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);
        $data = $request->validate([
            'stock_quantity' => 'required|integer|min:0',
            'import_price' => 'nullable|numeric',
            'sale_price' => 'nullable|numeric',
            'unit' => 'nullable|string|max:50',
            'expired_date' => 'nullable|date',
        ], [
            'stock_quantity.required' => 'Vui lòng nhập số lượng tồn.',
            'stock_quantity.integer' => 'Số lượng tồn phải là số nguyên.',
            'stock_quantity.min' => 'Số lượng tồn không được nhỏ hơn 0.',
            'import_price.numeric' => 'Giá nhập phải là số.',
            'sale_price.numeric' => 'Giá bán phải là số.',
            'expired_date.date' => 'Ngày hết hạn không hợp lệ.',
        ]);

        $inventory->update($data);
        return response()->json($inventory);
    }

    public function destroy($id)
    {
        Inventory::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function lowStock()
    {
        return response()->json(
            Inventory::with('product')
                ->where('stock_quantity', '<=', 10)
                ->get()
        );
    }
    public function print()
    {
        return Inventory::with('product.category')
            ->where('stock_quantity', '<=', 10)
            ->get();
    }
    public function getByProduct(Request $request, $productId)
    {
        $user = $request->user();

        $branchId = $request->branch_id;

        if ($user->role === 'branch_manager') {
            $branchId = $user->branch_id;
        }

        $inventory = Inventory::where('product_id', $productId)
            ->where('branch_id', $branchId)
            ->first();

        return response()->json([
            'stock_quantity' => $inventory?->stock_quantity ?? 0
        ]);
    }
}
