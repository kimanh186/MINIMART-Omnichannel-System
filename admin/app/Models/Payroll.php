<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
        'employee_id',
        'month',
        'year',
        'total_minutes',
        'total_salary',
        'calculated_at',
    ];

    protected $casts = [
        'calculated_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    public function sessions()
{
    return $this->hasMany(EmployeeSession::class);
}

public function payrolls()
{
    return $this->hasMany(Payroll::class);
}

}
