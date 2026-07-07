<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Employee;
use App\Models\AttendanceSession;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\OrderItem;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        
        // DOANH THU HÔM NAY
        
        $todayRevenue = Order::when(
            $user->role === 'branch_manager',
            fn($q) => $q->where(
                'branch_id',
                $user->branch_id
            )
        )
            ->whereDate('created_at', today())
            ->sum('total');

        
        // ĐƠN HÀNG HÔM NAY
        
        $todayOrders = Order::when(
            $user->role === 'branch_manager',
            fn($q) => $q->where(
                'branch_id',
                $user->branch_id
            )
        )
            ->whereDate('created_at', today())
            ->count();

        
// DOANH THU THÁNG NÀY

$monthRevenue = Order::when(
    $user->role === 'branch_manager',
    fn($q) => $q->where(
        'branch_id',
        $user->branch_id
    )
)
    ->whereMonth('created_at', now()->month)
    ->whereYear('created_at', now()->year)
    ->sum('total');
    
// DOANH THU 3 THÁNG GẦN NHẤT


$threeMonthRevenue = Order::when(
    $user->role === 'branch_manager',
    fn($q) => $q->where(
        'branch_id',
        $user->branch_id
    )
)
    ->where(
        'created_at',
        '>=',
        now()->subMonths(2)->startOfMonth()
    )
    ->sum('total');

        
        // NHÂN VIÊN
        
        $employees = Employee::when(
            $user->role === 'branch_manager',
            fn($q) => $q->where(
                'branch_id',
                $user->branch_id
            )
        )->count();

        
        // NHÂN VIÊN ĐANG LÀM VIỆC
        
        $workingEmployeesQuery = AttendanceSession::with('employee')
            ->whereNull('check_out')
            ->when(
                $user->role === 'branch_manager',
                function ($q) use ($user) {
                    $q->whereHas(
                        'employee',
                        fn($sub) => $sub->where(
                            'branch_id',
                            $user->branch_id
                        )
                    );
                }
            );

        $workingEmployees = $workingEmployeesQuery->count();

        $workingEmployeesList = $workingEmployeesQuery
            ->get()
            ->pluck('employee.full_name');

        
        // SẢN PHẨM
        
        $products = Product::count();

        
        // SẢN PHẨM SẮP HẾT HÀNG
        
        $lowStock = Inventory::with('product')
            ->when(
                $user->role === 'branch_manager',
                fn($q) => $q->where(
                    'branch_id',
                    $user->branch_id
                )
            )
            ->where('stock_quantity', '<=', 10)
            ->take(5)
            ->get();

        
        // BIỂU ĐỒ 7 NGÀY GẦN NHẤT
        
        $revenueChart = [];
        $orderChart = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);

            $revenue = Order::when(
                $user->role === 'branch_manager',
                fn($q) => $q->where(
                    'branch_id',
                    $user->branch_id
                )
            )
                ->whereDate(
                    'created_at',
                    $date
                )
                ->sum('total');

            $orders = Order::when(
                $user->role === 'branch_manager',
                fn($q) => $q->where(
                    'branch_id',
                    $user->branch_id
                )
            )
                ->whereDate(
                    'created_at',
                    $date
                )
                ->count();

            $revenueChart[] = [
                'date' => $date->format('d/m'),
                'revenue' => (int) $revenue,
            ];

            $orderChart[] = [
                'date' => $date->format('d/m'),
                'orders' => $orders,
            ];
        }

        
// BIỂU ĐỒ DOANH THU 12 THÁNG

$monthlyRevenueChart = [];

for ($month = 1; $month <= 12; $month++) {
    $revenue = Order::when(
        $user->role === 'branch_manager',
        fn($q) => $q->where(
            'branch_id',
            $user->branch_id
        )
    )
        ->whereYear('created_at', now()->year)
        ->whereMonth('created_at', $month)
        ->sum('total');

    $monthlyRevenueChart[] = [
        'month' => 'T' . $month,
        'revenue' => (int) $revenue,
    ];
}

// TOP 5 SẢN PHẨM BÁN CHẠY


$topProducts = OrderItem::with('product')
    ->selectRaw(
        'product_id, SUM(quantity) as total_sold'
    )
    ->when(
        $user->role === 'branch_manager',
        function ($q) use ($user) {
            $q->whereHas(
                'order',
                function ($orderQuery) use ($user) {
                    $orderQuery->where(
                        'branch_id',
                        $user->branch_id
                    );
                }
            );
        }
    )
    ->groupBy('product_id')
    ->orderByDesc('total_sold')
    ->take(10)
    ->get()
    ->map(function ($item) {
        return [
            'product_id' => $item->product_id,
            'name' => $item->product?->name,
            'image' => $item->product?->image,
            'total_sold' => (int) $item->total_sold,
        ];
    });
            return response()->json([
    'today_revenue' => $todayRevenue,
    'month_revenue' => $monthRevenue,
    'three_month_revenue' => $threeMonthRevenue,
    'today_orders' => $todayOrders,

    'employees' => $employees,

    'working_employees' => $workingEmployees,

    'working_employee_list' => $workingEmployeesList,

    'products' => $products,

    'low_stock' => $lowStock,

    'revenue_chart' => $revenueChart,

    'order_chart' => $orderChart,

    'monthly_revenue_chart' => $monthlyRevenueChart,

    'top_products' => $topProducts,

]);
    }
}