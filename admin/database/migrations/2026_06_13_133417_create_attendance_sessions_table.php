<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $table) {
    $table->id();

    $table->foreignId('employee_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->timestamp('check_in');

    $table->timestamp('check_out')
        ->nullable();

    $table->integer('worked_minutes')
        ->default(0);

    $table->enum('status', [
        'pending',
        'approved',
        'rejected'
    ])->default('pending');

    $table->text('note')
        ->nullable();

    $table->foreignId('approved_by')
        ->nullable()
        ->constrained('employees')
        ->nullOnDelete();

    $table->timestamp('approved_at')
        ->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};
