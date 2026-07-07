<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'email',
        'phone',
        'address',
        'city',
        'district',
        'ward',
        'is_default'
    ];

    public function user()
    {
        return $this->belongsTo(CustomUser::class);
    }
}