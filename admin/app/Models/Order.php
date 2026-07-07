<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'employee_id', 'branch_id', 'customer_name', 'customer_phone',
        'total', 'payment_method', 'status', 'source',
        'receiver_name',
    'receiver_phone',
    'shipping_address',
    'shipping_city',
    'shipping_district',
    'shipping_ward',
    ];

    // Một đơn hàng có nhiều sản phẩm (OrderItem)
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    // Khách hàng
    public function CustomUser()
    {
        return $this->belongsTo(CustomUser::class, 'user_id');
    }

    // Nhân viên POS
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
    public function branch()
{
    return $this->belongsTo(Branch::class);
}
}
