<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    public function run()
    {
        Order::create([
            'customer_name' => 'Tran Van C',
            'customer_phone' => '0912345678',
            'total' => 500000,
            'payment_method' => 'cash',
            'status' => 'paid',
        ]);

        Order::factory(5)->create();
    }
}
