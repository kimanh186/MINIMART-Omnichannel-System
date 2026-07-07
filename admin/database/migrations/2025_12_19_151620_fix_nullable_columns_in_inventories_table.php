<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->string('product_name')->nullable()->change();
            $table->string('category')->nullable()->change();
            $table->string('brand')->nullable()->change();
            $table->string('unit')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->string('product_name')->nullable(false)->change();
            $table->string('category')->nullable(false)->change();
            $table->string('brand')->nullable(false)->change();
            $table->string('unit')->nullable(false)->change();
        });
    }
};
