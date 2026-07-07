<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::query();

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('full_name', 'like', "%{$keyword}%")
                    ->orWhere('username', 'like', "%{$keyword}%");
            });
        }

        $employees = $query->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        return view('admin.employees.index', compact('employees'));
    }


    public function create()
    {
        return view('admin.employees.create');
    }

    public function edit($id)
    {
        $employee = Employee::findOrFail($id);
        return view('admin.employees.edit', compact('employee'));
    }

    // ===========================
    // THÊM NHÂN VIÊN
    // ===========================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required',
            'username' => 'required|unique:employees',
            'password' => 'required|min:6',
            'role' => 'required',
            'salary_per_hour' => 'required|integer|min:0',
            'phone' => 'nullable',
            'gender' => 'nullable',
            'birthday' => 'nullable|date',
            'address' => 'nullable',
            'start_date' => 'nullable|date',
            'status' => 'nullable',
            'avatar' => 'nullable|image|max:2048'
        ]);

        // Upload avatar
        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('employees', 'public');
        }

        // Mã hóa mật khẩu
        $validated['password'] = Hash::make($validated['password']);

        Employee::create($validated);

        return redirect()
            ->route('employee.index')
            ->with('success', 'Thêm nhân viên thành công!');
    }

    // XEM THÔNG TIN 1 NHÂN VIÊN (API)
    public function show($id)
    {
        return response()->json(Employee::findOrFail($id));
    }

    // ===========================
    // CHỈNH SỬA NHÂN VIÊN
    // ===========================
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes',
            'username' => "sometimes|unique:employees,username,$id",
            'password' => 'nullable|min:6',
            'role' => 'sometimes',
            'salary_per_hour' => 'required|integer|min:0',
            'phone' => 'nullable',
            'gender' => 'nullable',
            'birthday' => 'nullable|date',
            'address' => 'nullable',
            'start_date' => 'nullable|date',
            'status' => 'nullable',
            'avatar' => 'nullable|image|max:2048'
        ]);

        // Giữ nguyên nếu rỗng
        $validated['birthday'] = $request->filled('birthday') ? $request->birthday : $employee->birthday;
        $validated['start_date'] = $request->filled('start_date') ? $request->start_date : $employee->start_date;

        // Mã hóa mật khẩu nếu nhập
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Upload avatar mới nếu có
        if ($request->hasFile('avatar')) {
            if ($employee->avatar) {
                Storage::disk('public')->delete($employee->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('employees', 'public');
        }

        // Cập nhật nhân viên
        $employee->update($validated);


        return redirect()
            ->route('employee.index')
            ->with('success', 'Cập nhật nhân viên thành công!');
    }


    // ===========================
    // XÓA NHÂN VIÊN
    // ===========================
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);

        if ($employee->avatar) {
            Storage::disk('public')->delete($employee->avatar);
        }

        $employee->delete();

        return redirect()
            ->route('employee.index')
            ->with('success', 'Xóa nhân viên thành công');
    }
}
