<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Order::with([
            'items.product',
            'employee',
            'CustomUser',
            'branch'
        ])->orderBy('created_at', 'desc');

        if (
            $user->role === 'branch_manager'
        ) {
            $query->where(
                'branch_id',
                $user->branch_id
            );
        }

        // Tìm theo ID / SĐT
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('id', $keyword)
                    ->orWhere('customer_phone', 'like', "%{$keyword}%");
            });
        }

        //
        if ($request->filled('branch_id')) {
            $query->where(
                'branch_id',
                $request->branch_id
            );
        }
        if ($request->filled('order_type')) {

            if ($request->order_type === 'online') {
                $query->whereNull('employee_id');
            }

            if ($request->order_type === 'pos') {
                $query->whereNotNull('employee_id');
            }
        }

        // Nhân viên
        if ($request->filled('employee')) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->employee . '%');
            });
        }

        // Trạng thái
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Thanh toán
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Ngày
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59',
            ]);
        }

        return response()->json(
            $query->paginate(15)
        );
    }

    // 👁 Chi tiết đơn hàng
    public function show($id)
    {
        $order = Order::with(['items.product', 'employee', 'CustomUser', 'branch'])
            ->findOrFail($id);
        $user = request()->user();

        if (
            $user->role === 'branch_manager'
            && $order->branch_id != $user->branch_id
        ) {
            abort(403);
        }

        return response()->json($order);
    }

    // 🔄 Cập nhật trạng thái
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Cập nhật trạng thái đơn hàng thành công'
        ]);
    }
}
