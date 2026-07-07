<?php

namespace App\Exports;

use App\Models\Payroll;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PayrollExport implements FromCollection, WithHeadings
{
    protected int $month;
    protected int $year;

    public function __construct($month, $year)
    {
        $this->month = (int) $month;
        $this->year  = (int) $year;
    }

    public function collection()
    {
        return Payroll::with('employee')
            ->where('month', $this->month)
            ->where('year', $this->year)
            ->get()
            ->map(function ($p) {
                return [
                    'Nhân viên'   => $p->employee->full_name ?? '',
                    'Chức vụ'     => $p->employee->role ?? '',
                    'Tổng phút'   => $p->total_minutes,
                    'Lương/giờ'   => $p->employee->salary_per_hour ?? 0,
                    'Tổng lương'  => $p->total_salary,
                    'Tháng'       => $p->month,
                    'Năm'         => $p->year,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Nhân viên',
            'Chức vụ',
            'Tổng phút',
            'Lương/giờ',
            'Tổng lương',
            'Tháng',
            'Năm',
        ];
    }
}
