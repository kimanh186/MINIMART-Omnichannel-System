<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')
                  ->constrained('employees')
                  ->cascadeOnDelete();

            $table->integer('month')->comment('Tháng tính lương');
            $table->integer('year')->comment('Năm tính lương');

            $table->integer('total_minutes')
                  ->comment('Tổng số phút làm việc');

            $table->integer('total_salary')
                  ->comment('Tổng lương (VNĐ)');

            $table->timestamp('calculated_at')
                  ->comment('Thời điểm chốt lương');

            $table->timestamps();

            $table->unique(['employee_id', 'month', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
