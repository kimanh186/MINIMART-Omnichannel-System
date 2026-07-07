<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name'=>'Đồ uống','image'=>'drink.png'],
            ['name'=>'Đồ ăn nhanh','image'=>'snack.png'],
            ['name'=>'Bánh kẹo','image'=>'candy.png']
        ];

        foreach($categories as $cat){
            Category::create($cat);
        }
    }
}
