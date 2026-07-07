<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'payment_method',
        'amount',
        'status', 
        'transaction_code'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
