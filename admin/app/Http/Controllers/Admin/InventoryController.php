<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Inventory::with(['product.category']);

        // Tìm theo tên sản phẩm hoặc SKU
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->whereHas('product', function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                    ->orWhere('sku', 'like', "%{$keyword}%");
            });
        }

        // Lọc theo hạn sử dụng (inventory)
        if ($request->filled('expired_date')) {
            $query->whereDate('expired_date', '<=', $request->expired_date);
        }

        $inventories = $query->orderBy('updated_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return view('admin.inventory.index', compact('inventories'));
    }
    // Xem chi tiết
    public function show($id)
    {
        $inventory = Inventory::findOrFail($id);
        return view('admin.inventory.show', compact('inventory'));
    }
    public function print(Request $request)
    {
        $inventories = Inventory::with('product.category')
            ->where('stock_quantity', '<=', 10)
            ->orderBy('stock_quantity', 'asc')
            ->get();

        return view('admin.inventory.print', compact('inventories'));
    }

    public function exportPdf()
    {
        $inventories = Inventory::with('product.category')
            ->where('stock_quantity', '<=', 10)
            ->orderBy('stock_quantity', 'asc')
            ->get();

        $pdf = Pdf::loadView(
            'admin.inventory.print',
            compact('inventories')
        )->setPaper('a4', 'landscape');

        return $pdf->download('ton-kho-sap-het.pdf');
    }

    // Cập nhật tồn kho thủ công (nếu cần)
    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);

        $validated = $request->validate([
            'stock_quantity' => 'sometimes|integer|min:0',
            'import_price' => 'sometimes|numeric',
            'sale_price' => 'sometimes|numeric',
            'updated_date' => 'nullable|date',
            'status' => 'sometimes',
        ]);

        $inventory->update($validated);

        return response()->json($inventory);
    }
    public function create(Request $request)
    {
        $products = Product::all();
        $selectedProductId = $request->product_id;

        $currentStock = 0;

        if ($selectedProductId) {
            $inventory = Inventory::where('product_id', $selectedProductId)->first();
            $currentStock = $inventory?->stock_quantity ?? 0;
        }

        return view('admin.inventory.create', compact(
            'products',
            'selectedProductId',
            'currentStock'
        ));
    }


public function store(Request $request)
{
    $request->validate([
        'product_id'   => 'required|exists:products,id',
        'add_quantity' => 'required|integer|min:0',
        'import_price' => 'nullable|numeric',
        'sale_price'   => 'nullable|numeric',
        'unit'         => 'nullable|string|max:50',
        'expired_date' => 'nullable|date',
    ]);

    $inventory = Inventory::where('product_id', $request->product_id)->first();

    $currentStock = $inventory?->stock_quantity ?? 0;
    $newStock = $currentStock + $request->add_quantity;

    $inventory = Inventory::updateOrCreate(
        ['product_id' => $request->product_id],
        [
            'stock_quantity' => $newStock,
            'unit'           => $request->unit,
            'import_price'   => $request->import_price,
            'sale_price'     => $request->sale_price,
            'expired_date'   => $request->expired_date,
            'updated_date'   => now(),
            'status' => $newStock == 0
                ? 'out_of_stock'
                : ($newStock <= 10 ? 'low_stock' : 'in_stock'),
        ]
    );

    Product::where('id', $request->product_id)->update([
        'stock' => $newStock
    ]);

    return redirect()->route('inventory.index')
        ->with('success', 'Nhập thêm tồn kho thành công');
}


    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);

        Product::where('id', $inventory->product_id)->update([
            'stock' => 0
        ]);
        $inventory->delete();

        return redirect()
            ->route('inventory.index')
            ->with('success', 'Xóa tồn kho thành công');
    }
    // Kiểm kho + cảnh báo tồn kho
    public function checkStock()
    {
        $lowStock = Inventory::where('stock_quantity', '<=', 10)->get();

        return response()->json([
            'low_stock_items' => $lowStock
        ]);
    }
    //sap
    public function lowStock()
    {
        $inventories = Inventory::with('product')
            ->whereBetween('stock_quantity', [1, 10])
            ->get();

        return view('admin.inventory.index', compact('inventories'));
    }
    //het
    public function expired()
    {
        $inventories = Inventory::with('product')
            ->whereNotNull('expired_date')
            ->where('expired_date', '<', now())
            ->get();

        return view('admin.inventory.index', compact('inventories'));
    }
}
