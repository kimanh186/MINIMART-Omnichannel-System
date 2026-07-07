<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::query();
        $user = $request->user();

        if (
            $user->role === 'branch_manager'
        ) {
            $query->where(
                'branch_id',
                $user->branch_id
            );
        }

        // Lọc theo ngày
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('report_date', [
                $request->start_date,
                $request->end_date
            ]);
        }

        //lọc chi nhánh 
        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        $totalQuery = clone $query;

        $reports = $query->with('branch')->orderBy('report_date', 'desc')->paginate(15);

        // Tính tổng
        $totalOrders   = $totalQuery->sum('total_orders');
        $totalQuantity = $totalQuery->sum('quantity_sold');
        $totalRevenue  = $totalQuery->sum('revenue');
        $totalProfit   = $totalQuery->sum('profit');

        return response()->json([
            'data' => $reports->items(),
            'current_page' => $reports->currentPage(),
            'last_page' => $reports->lastPage(),
            'total_orders' => $totalOrders,
            'total_quantity' => $totalQuantity,
            'total_revenue' => $totalRevenue,
            'total_profit' => $totalProfit,
        ]);
    }

    // Chi tiết một báo cáo
    public function show($id)
    {
        $report = Report::with('product.category')->findOrFail($id);

        // Lấy danh sách đơn hàng có sản phẩm này trong ngày đó
        $orders = OrderItem::where('product_id', $report->product_id)
            ->whereHas('order', function ($q) use ($report) {
                $q->whereDate('created_at', $report->report_date);
            })
            ->with('order')
            ->get();

        return response()->json([
            'report' => $report,
            'orders' => $orders,
        ]);
    }
    public function print(Request $request)
{
    $query = Report::query();

    $user = $request->user();

    if (
        $user->role === 'branch_manager'
    ) {
        $query->where(
            'branch_id',
            $user->branch_id
        );
    }

    if ($request->filled('start_date') && $request->filled('end_date')) {
        $query->whereBetween('report_date', [
            $request->start_date,
            $request->end_date
        ]);
    }

    if ($request->filled('branch_id')) {
        $query->where(
            'branch_id',
            $request->branch_id
        );
    }

    $reports = $query
        ->with('branch')
        ->orderBy('report_date', 'desc')
        ->get();

    return response()->json([
        'data' => $reports,
        'total_orders'   => $reports->sum('total_orders'),
        'total_quantity' => $reports->sum('quantity_sold'),
        'total_revenue'  => $reports->sum('revenue'),
        'total_profit'   => $reports->sum('profit'),
    ]);
}
}
