<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $table = 'reports';

    protected $fillable = [
        'report_date',
        'branch_id',
        'product_id',
        'product_name',
        'category',
        'quantity_sold',
        'revenue',
        'profit',
        'total_orders',
        'inventory_status',
    ];

    protected $casts = [
        'report_date' => 'date',
        'quantity_sold' => 'integer',
        'revenue' => 'decimal:2',
        'profit' => 'decimal:2',
        'total_orders' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function getInventoryStatusTextAttribute()
    {
        return match ($this->inventory_status) {
            'in_stock' => 'Còn hàng',
            'low_stock' => 'Sắp hết',
            'out_of_stock' => 'Hết hàng',
            default => 'Không xác định',
        };
    }
}
