<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('employees', function ($table) {

            $table->enum(
                'employment_type',
                ['part_time', 'full_time']
            )->default('part_time');

            $table->decimal(
                'salary_per_month',
                15,
                0
            )->nullable();

            $table->boolean(
                'participate_insurance'
            )->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            //
        });
    }
};
