<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('email')->nullable()->change();

            // Thêm các cột mới nếu chưa có
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->unique()->after('name');
            }

            if (!Schema::hasColumn('users', 'customer_group')) {
                $table->string('customer_group')->default('normal')->after('username');
            }

            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            if (!Schema::hasColumn('users', 'gender')) {
                $table->string('gender')->nullable()->after('phone');
            }

            if (!Schema::hasColumn('users', 'birthday')) {
                $table->date('birthday')->nullable()->after('gender');
            }

            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('birthday');
            }

            if (!Schema::hasColumn('users', 'address')) {
                $table->string('address')->nullable()->after('birthday');
            }

        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('email')->nullable(false)->change();
            $table->dropColumn([
                'username',
                'customer_group',
                'phone',
                'gender',
                'birthday',
                'avatar',
                'address'
            ]);
        });
    }
}
