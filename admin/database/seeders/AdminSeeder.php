<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

Employee::create([
    'full_name' => 'KIm',
    'username' => 'superAdmin',
    'password' => Hash::make('123456'),
    'role' => 'superadmin',
    'status' => 1
]);
