<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Inventory;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',

            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',

            'receiver_name' => 'nullable|string|max:255',
            'receiver_phone' => 'nullable|string|max:20',
            'shipping_address' => 'nullable|string|max:255',
            'shipping_city' => 'nullable|string|max:255',
            'shipping_district' => 'nullable|string|max:255',
            'shipping_ward' => 'nullable|string|max:255',

            'total' => 'required|numeric|min:0',

            'payment_method' =>
            'required|in:cash,card,ewallet,bank,vnpay',

            'branch_id' =>
            'required|exists:branches,id',

            'source' =>
            'required|in:web,pos',

            'employee_id' =>
            'nullable|integer|exists:employees,id',
        ]);

        try {

            $order = DB::transaction(function () use ($request) {

                $inventories = [];

                foreach ($request->items as $item) {

                    $inventory = Inventory::where(
                        'product_id',
                        $item['product_id']
                    )
                        ->where(
                            'branch_id',
                            $request->branch_id
                        )
                        ->lockForUpdate()
                        ->first();

                    if (!$inventory) {
                        throw new Exception(
                            'Không tìm thấy tồn kho của sản phẩm tại chi nhánh.'
                        );
                    }

                    if (
                        $inventory->stock_quantity
                        < $item['quantity']
                    ) {
                        throw new Exception(
                            'Sản phẩm '
                                . ($inventory->product->name ?? '')
                                . ' không đủ tồn kho. Chỉ còn '
                                . $inventory->stock_quantity
                                . ' sản phẩm.'
                        );
                    }

                    $inventories[$item['product_id']] =
                        $inventory;
                }


                if (
                    $request->source === 'pos'
                    && $request->payment_method === 'cash'
                ) {
                    $status = 'paid';
                } else {
                    $status = 'pending';
                }



                $userId = null;

                if ($request->source === 'web') {
                    $userId = $request->user()?->id;
                }


                $order = Order::create([
                    'user_id' => $userId,

                    'employee_id' =>
                    $request->employee_id,

                    'branch_id' =>
                    $request->branch_id,

                    'customer_name' =>
                    $request->customer_name,

                    'customer_phone' =>
                    $request->customer_phone,

                    'receiver_name' =>
                    $request->receiver_name,

                    'receiver_phone' =>
                    $request->receiver_phone,

                    'shipping_address' =>
                    $request->shipping_address,

                    'shipping_city' =>
                    $request->shipping_city,

                    'shipping_district' =>
                    $request->shipping_district,

                    'shipping_ward' =>
                    $request->shipping_ward,

                    'total' =>
                    $request->total,

                    'payment_method' =>
                    $request->payment_method,

                    'source' =>
                    $request->source,

                    'status' =>
                    $status,
                ]);



                foreach ($request->items as $item) {

                    $inventory =
                        $inventories[$item['product_id']];

                    $orderItem = OrderItem::create([
                        'order_id' =>
                        $order->id,

                        'product_id' =>
                        $item['product_id'],

                        'quantity' =>
                        $item['quantity'],

                        'price' =>
                        $item['price'],
                    ]);


                    /*
                    |--------------------------------------------------------------------------
                    | TRỪ TỒN KHO
                    |--------------------------------------------------------------------------
                    */

                    $inventory->stock_quantity -=
                        $item['quantity'];

                    if ($inventory->stock_quantity <= 0) {

                        $inventory->stock_quantity = 0;

                        $inventory->status =
                            'out_of_stock';
                    } elseif (
                        $inventory->stock_quantity <= 10
                    ) {

                        $inventory->status =
                            'low_stock';
                    } else {

                        $inventory->status =
                            'in_stock';
                    }

                    $inventory->updated_date = now();

                    $inventory->save();


                    /*
                    |--------------------------------------------------------------------------
                    | CẬP NHẬT TỔNG TỒN PRODUCT
                    |--------------------------------------------------------------------------
                    */

                    $totalStock = Inventory::where(
                        'product_id',
                        $item['product_id']
                    )
                        ->sum('stock_quantity');

                    $orderItem->product->update([
                        'stock' => $totalStock,
                    ]);


                    /*
                    |--------------------------------------------------------------------------
                    | CẬP NHẬT BÁO CÁO
                    |--------------------------------------------------------------------------
                    */

                    $report = Report::firstOrNew([
                        'product_id' =>
                        $item['product_id'],

                        'report_date' =>
                        now()->toDateString(),

                        'branch_id' =>
                        $request->branch_id,
                    ]);

                    $report->branch_id =
                        $request->branch_id;

                    $report->product_name =
                        $orderItem->product->name;

                    $report->category =
                        $orderItem
                        ->product
                        ->category
                        ->name ?? null;

                    $report->quantity_sold =
                        ($report->quantity_sold ?? 0)
                        + $item['quantity'];

                    $report->revenue =
                        ($report->revenue ?? 0)
                        + (
                            $item['quantity']
                            * (
                                $inventory->sale_price
                                ?? $item['price']
                            )
                        );

                    $report->profit =
                        ($report->profit ?? 0)
                        + (
                            $item['quantity']
                            * (
                                (
                                    $inventory->sale_price
                                    ?? $item['price']
                                )
                                -
                                (
                                    $inventory->import_price
                                    ?? 0
                                )
                            )
                        );

                    $report->total_orders =
                        ($report->total_orders ?? 0)
                        + 1;

                    $report->inventory_status =
                        $inventory->status;

                    $report->save();
                }

                return $order;
            });


            return response()->json([
                'status' => true,
                'message' =>
                'Tạo đơn hàng thành công.',
                'order_id' =>
                $order->id,
            ], 201);
        } catch (Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }


    public function status($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status' => 'not_found',
            ], 404);
        }

        return response()->json([
            'status' => $order->status,
        ]);
    }


    public function cancel(Request $request, $id)
    {
        $user = $request->user();

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if ($order->status !== 'pending') {
            return response()->json([
                'message' =>
                'Đơn hàng này không thể hủy.',
            ], 422);
        }

        $order->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' =>
            'Hủy đơn hàng thành công!',

            'data' =>
            $order,
        ]);
    }
}
