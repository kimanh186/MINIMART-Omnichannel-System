<?php

return [

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [

        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        'admin' => [
            'driver' => 'session',
            'provider' => 'employees',
        ],

        'sanctum' => [
            'driver' => 'sanctum',
            'provider' => 'users',
        ],

        'admin-sanctum' => [
            'driver' => 'sanctum',
            'provider' => 'employees',
        ],
        'pos-sanctum' => [
        'driver' => 'sanctum',
        'provider' => 'employees',
    ],


    ],

    'providers' => [

        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\CustomUser::class,
        ],

        'employees' => [
            'driver' => 'eloquent',
            'model' => App\Models\Employee::class,
        ],

    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];