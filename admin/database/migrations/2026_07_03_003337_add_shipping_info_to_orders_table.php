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
        Schema::table('orders', function (Blueprint $table) {
    $table->string('receiver_name')->nullable();
    $table->string('receiver_phone')->nullable();

    $table->string('shipping_address')->nullable();
    $table->string('shipping_city')->nullable();
    $table->string('shipping_district')->nullable();
    $table->string('shipping_ward')->nullable();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
};
