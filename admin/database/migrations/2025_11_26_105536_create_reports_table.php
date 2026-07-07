<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();

            $table->date('report_date'); // thời gian báo cáo
            $table->unsignedBigInteger('product_id')->nullable(); // mã sản phẩm
            $table->string('product_name')->nullable(); // tên sản phẩm
            $table->string('category')->nullable(); // danh mục
            $table->integer('quantity_sold')->default(0); // số lượng bán ra
            $table->decimal('revenue', 15, 2)->default(0); // doanh thu
            $table->decimal('profit', 15, 2)->default(0); // lợi nhuận
            $table->integer('total_orders')->default(0); // tổng số đơn
            $table->string('inventory_status')->nullable(); // tình trạng tồn kho (còn hàng / sắp hết / hết hàng)

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
