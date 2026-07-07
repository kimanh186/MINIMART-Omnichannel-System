<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomUser;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class CustomUserController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomUser::query();

        if ($request->filled('phone')) {
            $query->where(function ($q) use ($request) {
                $q->where('phone', 'like', '%' . $request->phone . '%')
                    ->orWhere('email', 'like', '%' . $request->phone . '%')
                    ->orWhere('name', 'like', '%' . $request->phone . '%');
            });
        }
        $users = $query->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();
        return view('admin.customUser.index', compact('users'));
    }
    public function show($id)
    {
        $user = CustomUser::findOrFail($id);

        $orders = Order::where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return view('admin.customUser.show', compact('user', 'orders'));
    }

    // Form tạo khách hàng mới
    public function create()
    {
        return view('admin.Customuser.create');
    }

    // Lưu khách hàng mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'customer_group' => 'required',
            'phone' => 'nullable',
            'gender' => 'nullable',
            'birthday' => 'nullable|date',
            'address' => 'nullable',
            'avatar' => 'nullable|image|max:2048',
            'password' => 'required|min:6'
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('users', 'public');
        }

        $validated['password'] = Hash::make($validated['password']);

        CustomUser::create($validated);

        return redirect()->route('Customuser.index')->with('success', 'Thêm khách hàng thành công!');
    }

    // Form sửa khách hàng
    public function edit($id)
    {
        $user = CustomUser::findOrFail($id);
        return view('admin.Customuser.edit', compact('user'));
    }

    // Cập nhật khách hàng
    public function update(Request $request, $id)
    {
        $user = CustomUser::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes',
            'username' => "sometimes|unique:users,username,$id",
            'email' => "sometimes|email|unique:users,email,$id",
            'customer_group' => 'sometimes',
            'phone' => 'nullable',
            'gender' => 'nullable',
            'birthday' => 'nullable|date',
            'address' => 'nullable',
            'avatar' => 'nullable|image|max:2048',
            'password' => 'nullable|min:6'
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('users', 'public');
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('user.index')->with('success', 'Cập nhật khách hàng thành công!');
    }

    // Xóa khách hàng
    public function destroy($id)
    {
        $user = CustomUser::findOrFail($id);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return redirect()->route('user.index')->with('success', 'Xóa khách hàng thành công!');
    }
}
