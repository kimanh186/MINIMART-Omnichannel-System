<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;

class InventorySeeder extends Seeder
{
    public function run()
    {
        Inventory::create([
            'product_id' => 1,
            'product_name' => 'Sản phẩm A',
            'category' => 'Category 1',
            'brand' => 'Brand X',
            'stock_quantity' => 50,
            'unit' => 'pcs',
            'import_price' => 10000,
            'sale_price' => 15000,
            'updated_date' => now(),
            'status' => 'in_stock',
        ]);

        Inventory::factory(5)->create();
    }
}
