<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'customer_name' => $this->faker->name(),
            'customer_phone' => $this->faker->phoneNumber(),
            'total' => $this->faker->randomFloat(2, 100, 1000),
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'ewallet', 'bank']),
            'status' => $this->faker->randomElement(['pending', 'paid', 'cancelled']),
        ];
    }
}
