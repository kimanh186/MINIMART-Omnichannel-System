<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'branch_id',
        'message',
        'status',
    ];
    public function branch()
{
    return $this->belongsTo(
        Branch::class
    );
}
}