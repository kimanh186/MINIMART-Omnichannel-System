<?php

namespace App\Exports;

use App\Models\Report;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ReportExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    ShouldAutoSize
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = Report::query();

        if ($this->request->filled('start_date') && $this->request->filled('end_date')) {
            $query->whereBetween('report_date', [
                $this->request->start_date,
                $this->request->end_date
            ]);
        }

        return $query
            ->orderBy('report_date', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'STT',
            'Mã sản phẩm',
            'Tên sản phẩm',
            'Danh mục',
            'Ngày',
            'Tổng đơn',
            'SL bán ra',
            'Doanh thu',
            'Lợi nhuận',
        ];
    }

    public function map($report): array
    {
        static $index = 1;

        return [
            $index++,
            $report->product_id,
            $report->product_name,
            $report->category,
            \Carbon\Carbon::parse($report->report_date)->format('d/m/Y'),
            $report->total_orders,
            $report->quantity_sold,
            $report->revenue,
            $report->profit,
        ];
    }
}
