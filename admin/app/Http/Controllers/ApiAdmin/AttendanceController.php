<?php

namespace App\Http\Controllers\ApiAdmin;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $items = AttendanceSession::with([
            'employee.branch',
            'approver'
        ])

            ->when(
                $user->role === 'branch_manager',
                function ($q) use ($user) {
                    $q->whereHas(
                        'employee',
                        function ($sub) use ($user) {
                            $sub->where(
                                'branch_id',
                                $user->branch_id
                            );
                        }
                    );
                }
            )

            ->when(
                $request->employee_id,
                function ($q, $employeeId) {
                    $q->where(
                        'employee_id',
                        $employeeId
                    );
                }
            )

            ->when(
                $request->keyword,
                function ($q, $keyword) {

                    $q->whereHas(
                        'employee',
                        function ($sub) use ($keyword) {

                            $sub->where(
                                'full_name',
                                'like',
                                "%{$keyword}%"
                            )
                                ->orWhere(
                                    'username',
                                    'like',
                                    "%{$keyword}%"
                                );
                        }
                    );
                }
            )
            ->when(
                $request->status,
                function ($q, $status) {
                    $q->where('status', $status);
                }
            )

            ->when(
                $request->from_date,
                function ($q, $date) {

                    $q->whereDate(
                        'check_in',
                        '>=',
                        $date
                    );
                }
            )

            ->when(
                $request->to_date,
                function ($q, $date) {

                    $q->whereDate(
                        'check_in',
                        '<=',
                        $date
                    );
                }
            )

            ->latest()
            ->paginate(20);

        return response()->json($items);
    }

    public function approve(
        Request $request,
        AttendanceSession $attendance
    ) {
        $attendance->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now()
        ]);

        return response()->json([
            'success' => true
        ]);
    }
    public function update(
        Request $request,
        AttendanceSession $attendance
    ) {
        $request->validate([
            'check_in' => 'required',
            'check_out' => 'required'
        ]);

        $checkIn = Carbon::parse(
            $request->check_in
        );

        $checkOut = Carbon::parse(
            $request->check_out
        );

        $attendance->update([
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'worked_minutes' =>
            $checkIn->diffInMinutes(
                $checkOut
            )
        ]);

        return response()->json([
            'success' => true
        ]);
    }
    public function checkIn(Request $request)
    {
        $employee = $request->user();

        $opened = AttendanceSession::where(
            'employee_id',
            $employee->id
        )
            ->whereNull('check_out')
            ->exists();

        if ($opened) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đang có ca chưa checkout'
            ], 422);
        }

        AttendanceSession::create([
            'employee_id' => $employee->id,
            'check_in' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Điểm danh vào ca thành công'
        ]);
    }

    public function checkOut(Request $request)
    {
        $employee = $request->user();

        $session = AttendanceSession::where(
            'employee_id',
            $employee->id
        )
            ->whereNull('check_out')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Không có ca làm đang mở'
            ], 422);
        }

        $checkout = now();

        $session->update([
            'check_out' => $checkout,
            'worked_minutes' =>
            $session->check_in
                ->diffInMinutes($checkout)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kết thúc ca làm thành công'
        ]);
    }

    public function destroy(
        AttendanceSession $attendance
    ) {

        if (
            $attendance->status === 'approved'
        ) {
            return response()->json([
                'message' =>
                'Không thể xóa công đã duyệt'
            ], 422);
        }

        $attendance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa công thành công'
        ]);
    }
}
