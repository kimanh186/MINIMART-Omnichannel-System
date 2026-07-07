<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id(); 
            $table->string('full_name');
            $table->string('username')->unique();
            $table->string('password');
            $table->string('role')->default('staff'); 
            // admin, warehouse, cashier, staff...

            $table->string('phone')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('birthday')->nullable();
            $table->string('address')->nullable();

            $table->date('start_date')->nullable();

            $table->enum('status', ['active', 'inactive', 'paused'])
                  ->default('active');
            // active = đang làm, inactive = nghỉ việc, paused = tạm ngưng

            $table->string('avatar')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
