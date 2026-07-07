<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'category_id',
        'brand_id',
        'description',
        'price',
        'import_price',
        'stock',
        'image',
        'expiry_date',
        'active',
        'promotion',
    ];

    //
    protected $appends = ['final_price'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function getFinalPriceAttribute()
    {
        return max($this->price - $this->promotion, 0);
    }
    public function getIsExpiredAttribute()
    {
        if (!$this->expiry_date) {
            return false;
        }

        return Carbon::parse($this->expiry_date)->lt(Carbon::today());
    }
}
