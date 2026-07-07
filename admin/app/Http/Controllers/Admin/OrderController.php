<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'employee', 'CustomUser'])
            ->orderBy('created_at', 'desc');

        // Tìm kiếm theo ID hoặc số điện thoại khách
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('id', $keyword)
                    ->orWhere('customer_phone', 'like', "%{$keyword}%");
            });
        }

        // Tìm kiếm theo tên nhân viên
        if ($request->filled('employee')) {
            $employeeName = $request->employee;
            $query->whereHas('employee', function ($q) use ($employeeName) {
                $q->where('full_name', 'like', "%{$employeeName}%");
            });
        }

        if ($request->filled('payment_method') && in_array($request->payment_method, ['cash', 'vnpay'])) {
            $query->where('payment_method', $request->payment_method);
        }

        // Lọc theo trạng thái
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        // Lọc theo khoảng ngày
if ($request->filled('start_date') && $request->filled('end_date')) {
    $query->whereBetween('created_at', [
        $request->start_date . ' 00:00:00',
        $request->end_date . ' 23:59:59'
    ]);
}

        $orders = $query->paginate(15)->withQueryString();

        return view('admin.order.index', compact('orders'));
    }


    public function show($id)
    {
        $order = Order::with(['items.product', 'employee', 'CustomUser'])
            ->findOrFail($id);

        return view('admin.order.show', compact('order'));
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $request->validate(['status' => 'required|in:pending,paid,cancelled']);
        $order->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Cập nhật trạng thái thành công!');
    }
}
