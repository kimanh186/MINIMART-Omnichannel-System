<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\EmployeeSession;

class Employee extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'employees';

    protected $fillable = [
        'full_name',
        'username',
        'password',
        'role',
        'branch_id',
        'employment_type',
        'salary_per_hour',
        'salary_per_month',
        'participate_insurance',
        'phone',
        'gender',
        'birthday',
        'address',
        'start_date',
        'status',
        'avatar',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'birthday'   => 'date:Y-m-d',
        'start_date' => 'date:Y-m-d',
    ];

    protected $appends = [
        'avatar_url',
    ];

    public function getAvatarUrlAttribute()
    {
        return $this->avatar
            ? asset('storage/' . $this->avatar)
            : null;
    }

    public function sessions()
    {
        return $this->hasMany(EmployeeSession::class);
    }

    public function getAuthIdentifierName()
    {
        return 'username';
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function attendances()
    {
        return $this->hasMany(
            AttendanceSession::class
        );
    }
}
