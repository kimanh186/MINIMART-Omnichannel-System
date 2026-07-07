<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\CustomUser;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomUser::query();

        if ($request->filled('keyword')) {
            $k = $request->keyword;
            $query->where('name', 'like', "%$k%")
                ->orWhere('email', 'like', "%$k%")
                ->orWhere('phone', 'like', "%$k%");
        }

        $customers = $query
    ->orderBy('id', 'desc')
    ->paginate(10);

return response()->json([
    'data' => $customers->items(),
    'current_page' => $customers->currentPage(),
    'last_page' => $customers->lastPage(),
    'total' => $customers->total(),
]);
    }

    public function show($id)
    {
        $user = CustomUser::findOrFail($id);

        $orders = Order::where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'user' => $user,
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'customer_group' => 'required',
            'phone' => 'nullable',
            'gender' => 'nullable',
            'birthday' => 'nullable|date',
            'address' => 'nullable',
            'avatar' => 'nullable|image|max:2048',
            'password' => 'required|min:6',
        ], [
            'name.required' => 'Vui lòng nhập họ và tên.',
            'username.required' => 'Vui lòng nhập tên đăng nhập.',
            'username.unique' => 'Tên đăng nhập đã tồn tại.',
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email đã được sử dụng.',
            'customer_group.required' => 'Vui lòng chọn nhóm khách hàng.',
            'birthday.date' => 'Ngày sinh không hợp lệ.',
            'avatar.image' => 'Tệp tải lên phải là hình ảnh.',
            'avatar.max' => 'Ảnh đại diện không được vượt quá 2MB.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('users', 'public');
        }

        $data['password'] = Hash::make($data['password']);

        return response()->json(
            CustomUser::create($data),
            201
        );
    }

    public function update(Request $request, $id)
    {
        $user = CustomUser::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes',
            'username' => "sometimes|unique:users,username,$id",
            'email' => "sometimes|email|unique:users,email,$id",
            'customer_group' => 'sometimes',
            'phone' => 'nullable',
            'gender' => 'nullable',
            'birthday' => 'nullable|date',
            'address' => 'nullable',
            'avatar' => 'nullable|image|max:2048',
            'password' => 'nullable|min:6',
        ], [
            'username.unique' => 'Tên đăng nhập đã tồn tại.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email đã được sử dụng.',
            'birthday.date' => 'Ngày sinh không hợp lệ.',
            'avatar.image' => 'Tệp tải lên phải là hình ảnh.',
            'avatar.max' => 'Ảnh đại diện không được vượt quá 2MB.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('users', 'public');
        }

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = CustomUser::findOrFail($id);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function myOrders(Request $request)
    {
        return Order::with('items.product')
            ->where(
                'user_id',
                $request->user()->id
            )
            ->orderByDesc('id')
            ->get();
    }
}
