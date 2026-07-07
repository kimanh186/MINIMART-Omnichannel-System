<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    protected $fillable = [
        'employee_id',
        'check_in',
        'check_out',
        'worked_minutes',
        'status',
        'note',
        'approved_by',
        'approved_at'
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'approved_at' => 'datetime'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function approver()
    {
        return $this->belongsTo(
            Employee::class,
            'approved_by'
        );
    }
}
