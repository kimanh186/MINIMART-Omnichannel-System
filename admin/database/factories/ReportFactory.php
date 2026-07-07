<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Report;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition()
    {
        return [
            'report_date' => $this->faker->date(),
            'product_id' => $this->faker->numberBetween(1, 10),
            'product_name' => $this->faker->word(),
            'category' => $this->faker->word(),
            'quantity_sold' => $this->faker->numberBetween(1, 100),
            'revenue' => $this->faker->randomFloat(2, 100, 1000),
            'profit' => $this->faker->randomFloat(2, 50, 500),
            'total_orders' => $this->faker->numberBetween(1, 20),
            'inventory_status' => $this->faker->randomElement(['in_stock', 'low_stock', 'out_of_stock']),
        ];
    }
}
