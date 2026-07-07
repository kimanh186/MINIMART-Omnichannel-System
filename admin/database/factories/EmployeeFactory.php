<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition()
    {
        return [
            'full_name' => $this->faker->name(),
            'username' => $this->faker->unique()->userName(),
            'password' => Hash::make('password123'), // mật khẩu mặc định
            'role' => $this->faker->randomElement(['admin','staff']),
            'phone' => $this->faker->phoneNumber(),
            'gender' => $this->faker->randomElement(['male','female']),
            'birthday' => $this->faker->date(),
            'address' => $this->faker->address(),
            'start_date' => $this->faker->date(),
            'status' => $this->faker->randomElement(['active','inactive']),
            'avatar' => null,
        ];
    }
}
