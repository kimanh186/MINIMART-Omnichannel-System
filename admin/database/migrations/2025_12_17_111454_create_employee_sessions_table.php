<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_sessions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')
                  ->constrained('employees')
                  ->cascadeOnDelete();

            $table->timestamp('login_at')
                  ->comment('Thời gian đăng nhập POS');

            $table->timestamp('logout_at')
                  ->nullable()
                  ->comment('Thời gian đăng xuất POS');

            $table->integer('worked_minutes')
                  ->nullable()
                  ->comment('Số phút làm việc');

            $table->string('pos_machine')
                  ->nullable()
                  ->comment('Tên hoặc mã máy POS');

            $table->string('ip_address')
                  ->nullable()
                  ->comment('IP máy POS');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_sessions');
    }
};
