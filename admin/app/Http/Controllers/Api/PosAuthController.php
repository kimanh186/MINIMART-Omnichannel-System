<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Models\EmployeeSession;
use Illuminate\Support\Facades\Hash;

class PosAuthController extends Controller
{

    public function login(Request $request)
{
    $employee = Employee::where('username', $request->username)->first();

    if (!$employee || !Hash::check($request->password, $employee->password)) {
        return response()->json(['message' => 'Sai tài khoản'], 401);
    }

    $hasActive = EmployeeSession::where('employee_id', $employee->id)
        ->whereNull('logout_at')
        ->exists();

    if ($hasActive) {
        return response()->json(['message' => 'Nhân viên đang đăng nhập'], 400);
    }

    // 👉 tạo session
    EmployeeSession::create([
        'employee_id' => $employee->id,
        'login_at' => now(),
        'pos_machine' => $request->pos_machine,
        'ip_address' => $request->ip(),
    ]);

    // 👉 tạo token
    $token = $employee->createToken('pos_token')->plainTextToken;

    return response()->json([
        'employee' => $employee,
        'token' => $token
    ]);
}

    public function logout(Request $request)
{
    $employee = $request->user();

    $session = EmployeeSession::where('employee_id', $employee->id)
        ->whereNull('logout_at')
        ->latest()
        ->first();

    if ($session) {
        $minutes = now()->diffInMinutes($session->login_at);

        $session->update([
            'logout_at' => now(),
            'worked_minutes' => $minutes,
        ]);
    }

    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Đăng xuất thành công',
        'worked_minutes' => $minutes ?? 0
    ]);
}

}
