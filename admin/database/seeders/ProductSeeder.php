<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            ['name'=>'Coca Cola','category_id'=>1,'price'=>15000,'stock'=>50,'image'=>'coke.png','promotion'=>0],
            ['name'=>'Pepsi','category_id'=>1,'price'=>14000,'stock'=>40,'image'=>'pepsi.png','promotion'=>0],
            ['name'=>'Bánh mỳ kẹp','category_id'=>2,'price'=>25000,'stock'=>30,'image'=>'bread.png','promotion'=>5000],
        ];

        foreach($products as $prod){
            Product::create($prod);
        }
    }
}
