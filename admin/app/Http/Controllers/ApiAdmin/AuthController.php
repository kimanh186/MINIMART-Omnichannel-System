<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function me(Request $request)
    {
        return response()->json(
            Employee::with('branch')
                ->find($request->user()->id)
        );
    }

    public function login(Request $request)
    {
        $request->validate([
    'username' => 'required',
    'password' => 'required',
], [
    'username.required' => 'Vui lòng nhập tên đăng nhập.',
    'password.required' => 'Vui lòng nhập mật khẩu.',
]);

        $employee = Employee::with('branch')
            ->where(
                'username',
                $request->username
            )
            ->first();

        if (
            !$employee ||
            !Hash::check(
                $request->password,
                $employee->password
            )
        ) {
            return response()->json([
                'message' => 'Sai tài khoản hoặc mật khẩu'
            ], 401);
        }

        // CHỈ CHO ADMIN ĐĂNG NHẬP
        if (
            !in_array(
                $employee->role,
                [
                    'super_admin',
                    'branch_manager'
                ]
            )
        ) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập hệ thống quản trị'
            ], 403);
        }

        $token = $employee
            ->createToken('admin-token')
            ->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $employee
        ]);
    }
}
