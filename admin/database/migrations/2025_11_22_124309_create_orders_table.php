<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    if (!Schema::hasTable('orders')) {
        Schema::create('orders', function(Blueprint $table){
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->cascadeOnDelete();
            $table->enum('source', ['web','pos'])->default('pos');
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->decimal('total',10,2);
            $table->string('payment_method'); 
            $table->enum('status', ['pending','paid','cancelled'])->default('pending');
            $table->timestamps();
        });
    }
}


    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
