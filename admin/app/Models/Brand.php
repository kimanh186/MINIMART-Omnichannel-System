<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = [
        'name',
        'logo'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function brand()
{
    return $this->belongsTo(
        Brand::class,
        'brand_id'
    );
}
}