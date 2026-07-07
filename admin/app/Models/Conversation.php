<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'status',
    ];

    public function customer()
    {
        return $this->belongsTo(
            CustomUser::class,
            'customer_id'
        );
    }

    public function messages()
    {
        return $this->hasMany(
            Message::class,
            'conversation_id'
        );
    }

    public function latestMessage()
    {
        return $this->hasOne(
            Message::class,
            'conversation_id'
        )->latestOfMany();
    }
}