<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('product_id');  
            $table->string('product_name');            
            $table->string('category');                
            $table->string('brand')->nullable();        

            $table->integer('stock_quantity')->default(0);  
            $table->string('unit')->nullable();          

            $table->decimal('import_price', 12, 2)->nullable(); 
            $table->decimal('sale_price', 12, 2)->nullable();   

            $table->date('updated_date')->nullable();   

            $table->enum('status', ['in_stock', 'low_stock', 'out_of_stock'])
                  ->default('in_stock');      

            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventories');
    }
};
