<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        Employee::updateOrCreate(
    ['username' => 'lethib'], // nếu đã tồn tại username này thì update
    [
        'full_name' => 'Le Thi B',
        'password' => Hash::make('password123'),
        'role' => 'admin',
        'phone' => '0987654321',
        'gender' => 'female',
        'birthday' => '1992-05-10',
        'address' => 'Ho Chi Minh',
        'start_date' => now(),
        'status' => 'active',
        'avatar' => null,
    ]
);


        Employee::factory(5)->create();
    }
}
