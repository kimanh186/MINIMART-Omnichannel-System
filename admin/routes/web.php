<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\CustomUserController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\PayrollController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Api\VNPayController;

Route::get('/payment/vnpay/return', [VNPayController::class, 'returnPayment']);
Route::get('/payment/vnpay/ipn', [VNPayController::class, 'ipnHandler']);

Route::prefix('admin')->group(function () {
    Route::get('/payroll/{employee}', [PayrollController::class, 'show'])->name('payroll.show');
    Route::post('/payroll/lock', [PayrollController::class, 'store'])->name('payroll.lock');
    Route::get('/payroll/export', [PayrollController::class, 'export'])->name('payroll.export');
    Route::get('/employee/{employee}/payroll/print', [PayrollController::class, 'print'])
        ->name('payroll.print');
});

Route::get('admin/dang-nhap', [AuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('admin/dang-nhap', [AuthController::class, 'login'])
    ->name('admin.login.submit');
Route::post('admin/dang-xuat', [AuthController::class, 'logout'])
    ->name('admin.logout');

Route::middleware('admin')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])
        ->name('dashboard');
    Route::prefix('category')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('category.index');
        Route::get('/create', [CategoryController::class, 'create'])->name('category.create');
        Route::post('/store', [CategoryController::class, 'store'])->name('category.store');
        Route::get('/edit/{id}', [CategoryController::class, 'edit'])->name('category.edit');
        Route::put('/update/{id}', [CategoryController::class, 'update'])->name('category.update');
        Route::get('/show/{id}', [CategoryController::class, 'show'])->name('category.show');
        Route::delete('/destroy/{id}', [CategoryController::class, 'destroy'])->name('category.destroy');
    });

    Route::prefix('product')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('product.index');
        Route::get('/create', [ProductController::class, 'create'])->name('product.create');
        Route::post('/store', [ProductController::class, 'store'])->name('product.store');
        Route::get('/edit/{id}', [ProductController::class, 'edit'])->name('product.edit');
        Route::put('/update/{id}', [ProductController::class, 'update'])->name('product.update');
        Route::get('/show/{id}', [ProductController::class, 'show'])->name('product.show');
        Route::delete('/destroy/{id}', [ProductController::class, 'destroy'])->name('product.destroy');
    });

    Route::prefix('order')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('order.index');
        Route::get('/create', [OrderController::class, 'create'])->name('order.create');
        Route::post('/store', [OrderController::class, 'store'])->name('order.store');
        Route::get('/detail/{id}', [OrderController::class, 'detail'])->name('order.detail');
        Route::post('/update/{id}', [OrderController::class, 'update'])->name('order.update');
        Route::get('/show/{id}', [OrderController::class, 'show'])->name('order.show');
        Route::delete('/destroy/{id}', [OrderController::class, 'destroy'])->name('order.destroy');
        Route::put('/status/{id}', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
        Route::get('/{id}', [OrderController::class, 'show'])
            ->name('orders.show');
    });
    

    Route::prefix('user')->group(function () {
        Route::get('/', [CustomUserController::class, 'index'])->name('user.index');
        Route::get('/create', [CustomUserController::class, 'create'])->name('user.create');
        Route::post('/store', [CustomUserController::class, 'store'])->name('user.store');
        Route::get('/edit/{id}', [CustomUserController::class, 'edit'])->name('user.edit');
        Route::put('/update/{id}', [CustomUserController::class, 'update'])->name('user.update');
        Route::delete('/destroy/{id}', [CustomUserController::class, 'destroy'])->name('user.destroy');
        Route::get('/show/{id}', [CustomUserController::class, 'show'])
            ->name('user.show');
    });

    Route::prefix('employee')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('employee.index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('employee.create');
        Route::post('/store', [EmployeeController::class, 'store'])->name('employee.store');
        Route::get('/edit/{id}', [EmployeeController::class, 'edit'])->name('employee.edit');
        Route::put('/update/{id}', [EmployeeController::class, 'update'])->name('employee.update');
        Route::get('/show/{id}', [EmployeeController::class, 'show'])->name('employee.show');
        Route::delete('/destroy/{id}', [EmployeeController::class, 'destroy'])->name('employee.destroy');
    });

    Route::prefix('inventory')->name('inventory.')->group(function () {

        Route::get('/print', [InventoryController::class, 'print'])
            ->name('print');

        Route::get('/pdf', [InventoryController::class, 'exportPdf'])
            ->name('pdf');

        Route::get('/', [InventoryController::class, 'index'])->name('index');
        Route::get('/create', [InventoryController::class, 'create'])->name('create');
        Route::post('/', [InventoryController::class, 'store'])->name('store');

        Route::get('/{id}', [InventoryController::class, 'show'])->name('show');
        Route::delete('/{id}', [InventoryController::class, 'destroy'])->name('destroy');
    });


    Route::prefix('reports')->name('reports.')->group(function () {

        Route::get('/', [ReportController::class, 'index'])
            ->name('index');

        Route::get('/print', [ReportController::class, 'print'])
            ->name('print');

        Route::get('/{id}', [ReportController::class, 'show'])
            ->name('show');
    });
});
