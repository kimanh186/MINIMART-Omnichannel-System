<?php

namespace App\Exports;

use App\Models\Inventory;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class LowStockExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    ShouldAutoSize
{
    public function collection()
    {
        return Inventory::with('product.category')
            ->where('stock_quantity', '<=', 10)
            ->orderBy('stock_quantity', 'asc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'STT',
            'Tên sản phẩm',
            'Danh mục',
            'Tồn kho',
            'Đơn vị',
            'Hạn sử dụng',
            'Trạng thái',
        ];
    }

    public function map($item): array
    {
        static $index = 1;

        return [
            $index++,
            $item->product->name ?? '-',
            $item->product->category->name ?? '-',
            $item->stock_quantity,
            $item->unit ?? '-',
            $item->expired_date
                ? \Carbon\Carbon::parse($item->expired_date)->format('d/m/Y')
                : '-',
            $item->stock_quantity == 0
                ? 'HẾT HÀNG'
                : 'SẮP HẾT',
        ];
    }
}
