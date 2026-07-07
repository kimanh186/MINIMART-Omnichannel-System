<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\Employee;
use App\Models\EmployeeSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
            'pos_machine' => 'nullable|string',
        ]);

        $employee = Employee::with('branch')
            ->where(
                'username',
                $request->username
            )
            ->first();

        if (!$employee || !Hash::check($request->password, $employee->password)) {
            return response()->json([
                'message' => 'Username hoặc mật khẩu không đúng'
            ], 401);
        }

        // AUTO đóng ca cũ nếu còn tồn tại
        EmployeeSession::where('employee_id', $employee->id)
            ->whereNull('logout_at')
            ->get()
            ->each(function ($session) {
                $login = Carbon::parse($session->login_at);
                $logout = now();

                $session->update([
                    'logout_at' => $logout,
                    'worked_minutes' => $login->diffInMinutes($logout),
                ]);
            });

        // Tạo token
        $token = $employee->createToken('pos_token')->plainTextToken;

        // Tạo ca mới
        $session = EmployeeSession::create([
            'employee_id' => $employee->id,
            'login_at' => now(),
            'pos_machine' => $request->pos_machine ?? 'POS-01',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'employee'   => $employee,
            'token'      => $token,
            'session_id' => $session->id
        ]);
    }


    // Lấy thông tin nhân viên POS
    public function me(Request $request)
{
    return response()->json(
        Employee::with('branch')
            ->find(
                $request->user()->id
            )
    );
}

    // LOGOUT POS (KẾT THÚC CA)
    public function logout(Request $request)
    {
        $employee = $request->user();

        $session = EmployeeSession::where('employee_id', $employee->id)
            ->whereNull('logout_at')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'Không tìm thấy ca làm đang hoạt động'
            ], 400);
        }

        $workedMinutes = max(
            0,
            $session->login_at->diffInMinutes(now())
        );

        $login = Carbon::parse($session->login_at);
        $logout = now();

        $session->update([
            'logout_at' => $logout,
            'worked_minutes' => $login->diffInMinutes($logout),
        ]);




        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công',
            'worked_minutes' => $workedMinutes
        ]);
    }
}
