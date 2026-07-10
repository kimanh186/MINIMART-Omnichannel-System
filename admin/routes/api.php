<?php

use App\Http\Controllers\ApiAdmin\BrandController;
use App\Http\Controllers\Admin\CustomUserController as AdminCustomUserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomUserController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\VNPayController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\StoreInfoController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\ChatSellerController;

use App\Http\Controllers\ApiAdmin\ConversationController;
use App\Http\Controllers\ApiAdmin\BannerController as AdminBanner;
use App\Http\Controllers\ApiAdmin\StoreInfoController as AdminStoreInfo;
use App\Http\Controllers\Api\CustomerAddressController;
use App\Http\Controllers\ApiAdmin\ContactController as AdminContact;
use App\Http\Controllers\ApiAdmin\CategoryController as AdminCategory;
use App\Http\Controllers\ApiAdmin\ProductController as AdminProduct;
use App\Http\Controllers\ApiAdmin\AuthController as AdminAuth;
use App\Http\Controllers\ApiAdmin\CustomerController as AdminCustomer;
use App\Http\Controllers\ApiAdmin\OrderController as AdminOrder;
use App\Http\Controllers\ApiAdmin\InventoryController as AdminInventory;
use App\Http\Controllers\ApiAdmin\ReportController as AdminReport;
use App\Http\Controllers\ApiAdmin\EmployeeController as AdminEmployee;
use App\Http\Controllers\ApiAdmin\PayrollController as AdminPayroll;
use App\Http\Controllers\ApiAdmin\AttendanceController;
use App\Http\Controllers\ApiAdmin\BranchController;
use App\Http\Controllers\ApiAdmin\DashboardController;

Route::post('/pos/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/store-info', [StoreInfoController::class, 'show']);

Route::get('/products/best-selling', [ProductController::class, 'bestSelling']);
Route::get('/products/promotions', [ProductController::class, 'promotions']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/sku/{sku}', [ProductController::class, 'findBySku']);
Route::post('/products/{id}/reduce-stock', [ProductController::class, 'reduceStock']);

Route::post('/payment/vnpay/create', [VNPayController::class, 'createPayment']);
Route::get('/payment/vnpay/return', [VNPayController::class, 'returnPayment']);
Route::post('/payment/vnpay/ipn', [VNPayController::class, 'ipnHandler']); 

Route::get('/orders/{id}/status', [OrderController::class, 'status']);

Route::get('/banners', [BannerController::class, 'index']);

Route::post('/customer/register', [CustomUserController::class, 'store']);
Route::post('/customer/login', [CustomUserController::class, 'login']);

Route::post("/chat", [ChatController::class, "chat"]);
Route::post('/contacts', [ContactController::class, 'store']);

Route::get('/brands', [BrandController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('web/orders', [OrderController::class, 'store']);
    Route::get('/customer/me', [CustomUserController::class, 'me']);
    Route::get('/customer/orders', [CustomUserController::class, 'myOrders']);
    Route::get('/customer/orders/{id}',[CustomUserController::class, 'orderDetail']);
    Route::put('/customer/change-password', [CustomUserController::class, 'changePassword']);
    Route::post('/customers', [CustomUserController::class, 'store']);
    Route::get('/customer/addresses', [CustomerAddressController::class, 'index']);
    Route::post('/customer/addresses', [CustomerAddressController::class, 'store']);
    Route::put('/customer/addresses/{id}', [CustomerAddressController::class, 'update']);
    Route::post('/customer/avatar', [CustomUserController::class, 'uploadAvatar']);
    Route::post('/customer/cover', [CustomUserController::class, 'uploadCover']);
    Route::delete('/customer/addresses/{id}', [CustomerAddressController::class, 'destroy']);
    Route::get('/customer/me', [CustomUserController::class, 'me']);
    Route::put('/customer/profile', [CustomUserController::class, 'updateProfile']);
    Route::post('/customer/logout', [CustomUserController::class, 'logout']);
     Route::get('/seller-chat', [ChatSellerController::class, 'show']);

    Route::post('/seller-chat/send', [ChatSellerController::class, 'send']);
});

Route::post('/customer/google',[CustomUserController::class, 'googleLogin']);
Route::post('/customer/forgot-password',[CustomUserController::class, 'forgotPassword']);
Route::post('/customer/reset-password', [CustomUserController::class, 'resetPassword']);
Route::get('/branches/nearest',[BranchController::class, 'nearest']);
Route::put('/customer/orders/{id}/cancel',[OrderController::class, 'cancel'])->middleware('auth:sanctum');


Route::middleware('auth:pos-sanctum')->group(function () {
    Route::get('/pos/me', [AuthController::class, 'me']);
    Route::post('/pos/logout', [AuthController::class, 'logout']);
    Route::post('pos/orders', [OrderController::class, 'store']);
    Route::get('/customers', [CustomUserController::class, 'index']);
    Route::post('/attendance/check-in',[AttendanceController::class, 'checkIn']);

    Route::post('/attendance/check-out',[AttendanceController::class, 'checkOut']);
});

/*
|--------------------------------------------------------------------------
| ADMIN API
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {

    Route::post('/login', [AdminAuth::class, 'login']);

    Route::middleware('auth:admin-sanctum')->group(function () {
        Route::get('/me', [AdminAuth::class, 'me']);
        Route::get('/dashboard', [DashboardController::class, 'index']);

        //BRANCH
        Route::get('/branches', [BranchController::class, 'index']);
        Route::post('/branches', [BranchController::class, 'store']);
        Route::get('/branches/{id}', [BranchController::class, 'show']);
        Route::put('/branches/{id}', [BranchController::class, 'update']);
        Route::patch('/branches/{id}/toggle', [BranchController::class, 'toggleStatus']);
        Route::delete('/branches/{id}', [BranchController::class, 'destroy']);

        // PRODUCTS
        Route::get('/products', [AdminProduct::class, 'index']);
        Route::post('/products', [AdminProduct::class, 'store']);
        Route::put('/products/{id}', [AdminProduct::class, 'update']);
        Route::delete('/products/{id}', [AdminProduct::class, 'destroy']);
        Route::get('/products/{id}', [AdminProduct::class, 'show']);

        // CATEGORIES 
        Route::get('/categories', [AdminCategory::class, 'index']);
        Route::post('/categories', [AdminCategory::class, 'store']);
        Route::get('/categories/{id}', [AdminCategory::class, 'show']);
        Route::put('/categories/{id}', [AdminCategory::class, 'update']);
        Route::delete('/categories/{id}', [AdminCategory::class, 'destroy']);

        //BRAND
        Route::apiResource('brands', BrandController::class);

        //ORDER
        Route::get('/orders', [AdminOrder::class, 'index']);
        Route::get('/orders/{id}', [AdminOrder::class, 'show']);
        Route::put('/orders/{id}/status', [AdminOrder::class, 'updateStatus']);

        //INVENTORY
        Route::get('/inventories/print', [AdminInventory::class, 'print']);
        Route::get('/inventories', [AdminInventory::class, 'index']);
        Route::post('/inventories', [AdminInventory::class, 'store']);
        Route::get('/inventories/{id}', [AdminInventory::class, 'show']);
        Route::put('/inventories/{id}', [AdminInventory::class, 'update']);
        Route::delete('/inventories/{id}', [AdminInventory::class, 'destroy']);
        Route::get('/inventories-low-stock', [AdminInventory::class, 'lowStock']);
        Route::get('/inventories/by-product/{productId}', [AdminInventory::class, 'getByProduct']);

        //REPORTS
        Route::get('/reports/print', [AdminReport::class, 'print']);
        Route::get('/reports', [AdminReport::class, 'index']);
        Route::get('/reports/{id}', [AdminReport::class, 'show']);

        // STORE INFO
        Route::get('/store-info', [AdminStoreInfo::class, 'show']);
        Route::put('/store-info', [AdminStoreInfo::class, 'update']);

        // EMPLOYEES
        Route::get('/employees', [AdminEmployee::class, 'index']);
        Route::post('/employees', [AdminEmployee::class, 'store']);
        Route::get('/employees/{id}', [AdminEmployee::class, 'show']);
        Route::put('/employees/{id}', [AdminEmployee::class, 'update']);
        Route::delete('/employees/{id}', [AdminEmployee::class, 'destroy']);

        //attendance
        Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
        Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
        Route::get('/attendance',[AttendanceController::class, 'index']);
        Route::put('/attendance/{attendance}', [AttendanceController::class, 'update']);
        Route::post('/attendance/{attendance}/approve',[AttendanceController::class, 'approve']);
        Route::delete('/attendance/{attendance}', [AttendanceController::class, 'destroy']);
        Route::get('/conversations', [ConversationController::class, 'index']
);

        Route::get('/conversations/{id}', [ConversationController::class, 'show']);
        Route::post('/conversations/{id}/reply',[ConversationController::class, 'reply']);

        // PAYROLL
        Route::get('/payroll/{employee}', [AdminPayroll::class, 'show']);
        Route::post('/payroll', [AdminPayroll::class, 'store']);
        // CONTACTS
        Route::get('/contacts', [AdminContact::class, 'index']);
        Route::get('/contacts/{id}', [AdminContact::class, 'show']);
        Route::put('/contacts/{id}/status', [AdminContact::class, 'updateStatus']);
        Route::delete('/contacts/{id}', [AdminContact::class, 'destroy']);

        // BANNERS
        Route::get('/banners', [AdminBanner::class, 'index']);
        Route::post('/banners',[AdminBanner::class, 'store']);
        Route::post('/banners/{id}',[AdminBanner::class, 'update']);
        Route::delete('/banners/{id}',[AdminBanner::class, 'destroy']);

        //USER
        Route::prefix('user')->group(function () {
            Route::get('/', [AdminCustomer::class, 'index']);
            Route::get('/{id}', [AdminCustomer::class, 'show']);
            Route::put('/{id}', [AdminCustomer::class, 'update']);
            Route::delete('/{id}', [AdminCustomer::class, 'destroy']);
        });
    });
});
