<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class CustomUser extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'username',
        'email',
        'customer_group',
        'phone',
        'gender',
        'birthday',
        'address',
        'avatar',
        'cover_image',
        'password',
        'points',
        'google_id',
        'otp',
        'otp_expired_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['customer_level'];

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class, 'user_id');
    }

    public function conversations()
{
    return $this->hasMany(
        Conversation::class,
        'customer_id'
    );
}

    public function getCustomerLevelAttribute()
    {
        $points = $this->points ?? 0;

        if ($points >= 6000) {
            return 'Kim cương';
        }

        if ($points >= 3500) {
            return 'Vàng';
        }

        if ($points >= 1000) {
            return 'Bạc';
        }

        return 'Thường';
    }
}
