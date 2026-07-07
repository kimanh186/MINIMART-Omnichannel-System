<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeSession;
use App\Models\Payroll;
use Illuminate\Http\Request;
use App\Exports\PayrollExport;
use Maatwebsite\Excel\Facades\Excel;

class PayrollController extends Controller
{
    public function print(Request $request, Employee $employee)
    {
        $month = $request->month ?? now()->month;
        $year  = $request->year ?? now()->year;

        $data = $this->calculatePayroll($employee, $month, $year);

        return view('admin.payroll.print', compact('employee', 'month', 'year') + $data);
    }

    public function show(Request $request, Employee $employee)
    {
        $month = $request->month ?? now()->month;
        $year  = $request->year ?? now()->year;

        $data = $this->calculatePayroll($employee, $month, $year);

        $sessions = $employee->sessions()
            ->whereYear('login_at', $year)
            ->whereMonth('login_at', $month)
            ->orderBy('login_at', 'asc')
            ->paginate(10);

        return view('admin.payroll.show', compact('employee', 'month', 'year', 'sessions') + $data);
    }


    private function calculatePayroll(Employee $employee, int $month, int $year)
    {
        $sessions = EmployeeSession::where('employee_id', $employee->id)
            ->whereMonth('login_at', $month)
            ->whereYear('login_at', $year)
            ->orderBy('login_at')
            ->get();

        $totalMinutes = $sessions->sum('worked_minutes');
        $grossSalary = round(($totalMinutes / 60) * $employee->salary_per_hour);

        $bhxh = round($grossSalary * 0.08);
        $bhyt = round($grossSalary * 0.015);
        $bhtn = round($grossSalary * 0.01);
        $netSalary = $grossSalary - ($bhxh + $bhyt + $bhtn);

        return compact('sessions', 'totalMinutes', 'grossSalary', 'bhxh', 'bhyt', 'bhtn', 'netSalary');
    }

    public function export(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year'  => 'required|integer|min:2000',
        ]);

        return Excel::download(
            new PayrollExport($request->month, $request->year),
            "bang-luong-{$request->month}-{$request->year}.xlsx"
        );
    }

    // Chốt lương theo tháng
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
        ]);

        $employee = Employee::findOrFail($request->employee_id);

        $totalMinutes = EmployeeSession::where('employee_id', $employee->id)
            ->whereMonth('login_at', $request->month)
            ->whereYear('login_at', $request->year)
            ->sum('worked_minutes');

        $grossSalary = round(($totalMinutes / 60) * $employee->salary_per_hour);

        $bhxh = round($grossSalary * 0.08);
        $bhyt = round($grossSalary * 0.015);
        $bhtn = round($grossSalary * 0.01);
        $totalInsurance = $bhxh + $bhyt + $bhtn;

        $netSalary = $grossSalary - $totalInsurance;

        Payroll::updateOrCreate(
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
        return back()->with('success', ' Chốt lương thành công');
    }
}
