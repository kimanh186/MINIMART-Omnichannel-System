<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\AttendanceSession;
use App\Models\Payroll;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    // ===========================
    // XEM BẢNG LƯƠNG 1 NHÂN VIÊN
    // ===========================
    public function show(Request $request, Employee $employee)
    {
        $month = $request->month ?? now()->month;
        $year  = $request->year ?? now()->year;

        return response()->json([
            'success' => true,
            'data' => $this->calculatePayroll($employee, $month, $year)
        ]);
    }

    // ===========================
    // CHỐT LƯƠNG
    // ===========================
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|integer|min:1|max:12',
            'year'  => 'required|integer|min:2000',
        ]);

        $employee = Employee::findOrFail($request->employee_id);

        $totalMinutes =
            AttendanceSession::where(
                'employee_id',
                $employee->id
            )
            ->where(
                'status',
                'approved'
            )
            ->whereMonth(
                'check_in',
                $request->month
            )
            ->whereYear(
                'check_in',
                $request->year
            )
            ->sum('worked_minutes');

if (
    $employee->employment_type
    === 'part_time'
) {

    $grossSalary = round(
        ($totalMinutes / 60)
        * $employee->salary_per_hour
    );

} else {

    $grossSalary =
        $employee->salary_per_month;
}

        $bhxh = 0;
$bhyt = 0;
$bhtn = 0;

if (
    $employee->participate_insurance
) {

    $bhxh = round(
        $grossSalary * 0.08
    );

    $bhyt = round(
        $grossSalary * 0.015
    );

    $bhtn = round(
        $grossSalary * 0.01
    );
}

        $netSalary = $grossSalary - ($bhxh + $bhyt + $bhtn);

        $payroll = Payroll::updateOrCreate(
            [
                'employee_id' => $employee->id,
                'month' => $request->month,
                'year' => $request->year,
            ],
            [
                'total_minutes' => $totalMinutes,
                'total_salary' => $grossSalary,
                'bhxh' => $bhxh,
                'bhyt' => $bhyt,
                'bhtn' => $bhtn,
                'net_salary' => $netSalary,
                'calculated_at' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Chốt lương thành công',
            'data' => $payroll
        ]);
    }

    // ===========================
    // TÍNH LƯƠNG (PRIVATE)
    private function calculatePayroll(Employee $employee, int $month, int $year)
    {
        $sessions = AttendanceSession::where(
            'employee_id',
            $employee->id
        )
            ->where(
                'status',
                'approved'
            )
            ->whereMonth('check_in', $month)
            ->whereYear('check_in', $year)
            ->orderByDesc('check_in')
            ->paginate(10);

        $totalMinutes = AttendanceSession::where(
            'employee_id',
            $employee->id
        )
            ->where(
                'status',
                'approved'
            )
            ->whereMonth('check_in', $month)
            ->whereYear('check_in', $year)
            ->sum('worked_minutes');

if (
    $employee->employment_type
    === 'part_time'
) {

    $grossSalary = round(
        ($totalMinutes / 60)
        * $employee->salary_per_hour
    );

} else {

    $grossSalary =
        $employee->salary_per_month;
}
        $bhxh = 0;
$bhyt = 0;
$bhtn = 0;

if (
    $employee->participate_insurance
) {

    $bhxh = round(
        $grossSalary * 0.08
    );

    $bhyt = round(
        $grossSalary * 0.015
    );

    $bhtn = round(
        $grossSalary * 0.01
    );
}

        return [
            'employee' => $employee,
            'total_minutes' => $totalMinutes,
            'gross_salary' => $grossSalary,
            'bhxh' => $bhxh,
            'bhyt' => $bhyt,
            'bhtn' => $bhtn,
            'net_salary' => $grossSalary - ($bhxh + $bhyt + $bhtn),

            // 👇 QUAN TRỌNG
            'sessions' => $sessions->items(),
            'session_meta' => [
                'current_page' => $sessions->currentPage(),
                'last_page' => $sessions->lastPage(),
            ],
        ];
    }
}
