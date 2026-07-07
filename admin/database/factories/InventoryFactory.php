<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Inventory;

class InventoryFactory extends Factory
{
    protected $model = Inventory::class;

    public function definition()
    {
        return [
            'product_id' => 1,
            'product_name' => $this->faker->word(),
            'category' => $this->faker->word(),
            'brand' => $this->faker->company(),
            'stock_quantity' => $this->faker->numberBetween(1, 100),
            'unit' => 'pcs',
            'import_price' => $this->faker->randomFloat(2, 10, 50),
            'sale_price' => $this->faker->randomFloat(2, 50, 200),
            'updated_date' => now(),
            'status' => $this->faker->randomElement(['in_stock', 'out_of_stock']),
        ];
    }
}
