<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Report;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;


class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::query();

        // Lọc theo khoảng ngày
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('report_date', [
                $request->start_date,
                $request->end_date
            ]);
        }
        $totalQuery = clone $query;

        $reports = $query->orderBy('report_date', 'desc')
            ->paginate(15)
            ->withQueryString();

        //  TÍNH TỔNG (theo dữ liệu đã lọc)
        $totalRevenue  = $totalQuery->sum('revenue');
        $totalProfit   = $totalQuery->sum('profit');
        $totalOrders   = $totalQuery->sum('total_orders');
        $totalQuantity = $totalQuery->sum('quantity_sold');

        return view('admin.report.index', compact(
            'reports',
            'totalRevenue',
            'totalProfit',
            'totalOrders',
            'totalQuantity'
        ));
    }

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

        return view('admin.report.show', compact('report', 'orders'));
    }


    public function print(Request $request)
    {
        $query = Report::query();

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('report_date', [
                $request->start_date,
                $request->end_date
            ]);
        }

        $reports = $query->orderBy('report_date', 'desc')->get();

        // TÍNH TỔNG
        $totalRevenue  = $reports->sum('revenue');
        $totalProfit   = $reports->sum('profit');
        $totalOrders   = $reports->sum('total_orders');
        $totalQuantity = $reports->sum('quantity_sold');

        return view('admin.report.print', compact(
            'reports',
            'totalRevenue',
            'totalProfit',
            'totalOrders',
            'totalQuantity'
        ));
    }

    public function exportPdf(Request $request)
    {
        $query = Report::query();

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('report_date', [
                $request->start_date,
                $request->end_date
            ]);
        }

        $reports = $query->orderBy('report_date', 'desc')->get();

        $pdf = Pdf::loadView(
            'admin.report.print',
            compact('reports')
        )->setPaper('a4', 'landscape');

        return $pdf->download('bao-cao-doanh-thu.pdf');
    }
}
