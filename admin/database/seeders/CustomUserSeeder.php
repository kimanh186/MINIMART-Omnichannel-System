<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CustomUser;
use Illuminate\Support\Facades\Hash;

class CustomUserSeeder extends Seeder
{
    public function run()
    {
        CustomUser::updateOrCreate(
            ['email' => 'a@example.com'],
            [
                'name' => 'Nguyen Van A',
                'username' => 'nguyenvana',
                'customer_group' => 'vip',
                'phone' => '0123456789',
                'gender' => 'male',
                'birthday' => '1990-01-01',
                
                'avatar' => null,
                'address' => 'Hanoi',
                'password' => Hash::make('password123'),
            ]
        );


        // CustomUser::factory(5)->create(); // nếu có factory
    }
}
