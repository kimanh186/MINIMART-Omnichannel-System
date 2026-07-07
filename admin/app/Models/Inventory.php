<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;
    protected $table = 'inventories';

    protected $fillable = [
        'product_id',
        'branch_id',
        'stock_quantity',
        'import_price',
        'sale_price',
        'expired_date',
        'updated_date',
        'status',
    ];


    protected $casts = [
        'updated_date' => 'date',
        'expired_date' => 'date',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }


    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function getStatusTextAttribute()
    {
        return match ($this->status) {
            'in_stock' => 'Còn hàng',
            'low_stock' => 'Sắp hết',
            'out_of_stock' => 'Hết hàng',
            default => 'Không xác định',
        };
    }
}
