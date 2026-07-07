<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $employees = Employee::with('branch');

        if (
            $user->role === 'branch_manager'
        ) {
            $employees->where(
                'branch_id',
                $user->branch_id
            );
        }

        $employees = $employees
            ->when($request->keyword, function ($q, $kw) {
                $q->where('full_name', 'like', "%$kw%")
                    ->orWhere('username', 'like', "%$kw%");
            })
            ->when($request->branch_id, function ($q, $branchId) {
                $q->where('branch_id', $branchId);
            })
            ->orderByDesc('id')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $employees->items(),
            'meta' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'total' => $employees->total(),
            ],
        ]);
    }


    public function show(Request $request, $id)
    {
        $user = $request->user();

        $employee = Employee::with('branch')
            ->findOrFail($id);

        if (
            $user->role === 'branch_manager'
            && $employee->branch_id != $user->branch_id
        ) {
            abort(403);
        }

        return response()->json([
            'success' => true,
            'data' => $employee
        ]);
    }

    // THÊM NHÂN VIÊN
    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name'        => 'required|string',
            'username'         => 'required|unique:employees',
            'password'         => 'required|min:6',
            'role' => 'required|in:staff,branch_manager',
            'branch_id' => 'nullable|exists:branches,id',
            'salary_per_hour' => 'nullable|integer|min:0',
            'employment_type' => 'required',
            'salary_per_month' => 'nullable|integer|min:0',
            'participate_insurance' => 'nullable|boolean',
            'phone'            => 'nullable',
            'gender'           => 'nullable',
            'birthday'         => 'nullable|date',
            'address'          => 'nullable',
            'start_date'       => 'nullable|date',
            'status'           => 'nullable',
            'avatar'           => 'nullable|image|max:2048',
        ]);

        $user = $request->user();

        if ($user->role === 'branch_manager') {
            $data['branch_id'] = $user->branch_id;
            $data['role'] = 'staff';
        }

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('employees', 'public');
        }

        $data['password'] = Hash::make($data['password']);

        $employee = Employee::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Thêm nhân viên thành công',
            'data'    => $employee,
        ], 201);
    }

    // CẬP NHẬT NHÂN VIÊN
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        $user = $request->user();

        if (
            $user->role === 'branch_manager'
            && $employee->branch_id != $user->branch_id
        ) {
            abort(403);
        }

        $data = $request->validate([
            'full_name'        => 'sometimes',
            'username'         => "sometimes|unique:employees,username,$id",
            'password'         => 'nullable|min:6',
            'role'             => 'sometimes',
            'branch_id' => 'nullable|exists:branches,id',
            'salary_per_hour' => 'nullable|integer|min:0',
            'employment_type' => 'sometimes',
            'salary_per_month' => 'nullable|integer|min:0',
            'participate_insurance' => 'nullable|boolean',
            'phone'            => 'nullable',
            'gender'           => 'nullable',
            'birthday'         => 'nullable|date',
            'address'          => 'nullable',
            'start_date'       => 'nullable|date',
            'status'           => 'nullable',
            'avatar'           => 'nullable|image|max:2048',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if ($request->hasFile('avatar')) {
            if ($employee->avatar) {
                Storage::disk('public')->delete($employee->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('employees', 'public');
        }

        $employee->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật nhân viên thành công',
            'data'    => $employee,
        ]);
    }

    // XÓA NHÂN VIÊN
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);


        if ($employee->avatar) {
            Storage::disk('public')->delete($employee->avatar);
        }

        $employee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa nhân viên thành công',
        ]);
    }
}
