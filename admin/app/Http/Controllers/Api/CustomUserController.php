<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomUser;
use App\Models\Order;
use Google\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class CustomUserController extends Controller
{
    public function index()
    {
        $users = CustomUser::select('id', 'name', 'phone', 'points')->get(); // chỉ cần thông tin cơ bản + points
        return response()->json($users);
    }
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required',
            'password' => 'required|min:6',
        ]);

        $user = CustomUser::where(
            'phone',
            $request->phone
        )->first();

        if (
            !$user ||
            !Hash::check(
                $request->password,
                $user->password
            )
        ) {
            return response()->json([
                'message' => 'Sai tài khoản hoặc mật khẩu'
            ], 401);
        }

        $token = $user
            ->createToken('customer-token')
            ->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
    public function googleLogin(Request $request)
    {
        $request->validate([
            'token' => 'required'
        ]);

        $client = new Client([
            'client_id' => env('GOOGLE_CLIENT_ID')
        ]);

        $payload = $client->verifyIdToken(
            $request->token
        );

        if (!$payload) {
            return response()->json([
                'message' => 'Token Google không hợp lệ'
            ], 401);
        }

        $user = CustomUser::where(
            'email',
            $payload['email']
        )->first();

        if (!$user) {
            $username = explode(
                '@',
                $payload['email']
            )[0] . rand(100, 999);

            $user = CustomUser::create([
                'name' => $payload['name'],
                'username' => $username,
                'email' => $payload['email'],
                'phone' => null,
                'customer_group' => 'normal',
                'avatar' => $payload['picture'],
                'google_id' => $payload['sub'],
                'password' => bcrypt(Str::random(20)),
            ]);
        }

        $token = $user
            ->createToken('customer-token')
            ->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        try {

            $request->validate([
                'email' => 'required|email'
            ]);

            $user = CustomUser::where(
                'email',
                $request->email
            )->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Email không tồn tại'
                ], 404);
            }

            $otp = rand(100000, 999999);

            $user->update([
                'otp' => $otp,
                'otp_expired_at' => now()->addMinutes(5)
            ]);

            Mail::raw(
                "Mã OTP của bạn là: $otp",
                function ($message) use ($user) {
                    $message
                        ->to($user->email)
                        ->subject('Đặt lại mật khẩu');
                }
            );

            return response()->json([
                'message' => 'Đã gửi OTP'
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required',
            'password' => 'required|min:6'
        ]);

        $user = CustomUser::where(
            'email',
            $request->email
        )
            ->where(
                'otp',
                $request->otp
            )
            ->first();

        if (
            !$user ||
            now()->gt($user->otp_expired_at)
        ) {
            return response()->json([
                'message' => 'OTP không hợp lệ'
            ], 400);
        }

        $user->update([
            'password' => bcrypt(
                $request->password
            ),
            'otp' => null,
            'otp_expired_at' => null,
        ]);

        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công'
        ]);
    }
    public function me(Request $request)
    {
        return response()->json(
            $request->user()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:users,phone',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ], [
            'name.required' => 'Vui lòng nhập họ và tên.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.unique' => 'Số điện thoại đã được sử dụng.',
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email đã được sử dụng.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
        ]);


        $user = CustomUser::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'username' => Str::slug($request->name) . rand(100, 999),
            'customer_group' => 'normal',
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        return response()->json($user, 201);
    }
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'address' => 'nullable|string|max:500',
        ], [
            'name.max' => 'Họ và tên không được vượt quá 255 ký tự.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email đã được sử dụng.',
            'address.max' => 'Địa chỉ không được vượt quá 500 ký tự.',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Cập nhật thành công',
            'user' => $user
        ]);
    }
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048'
        ]);

        $user = $request->user();

        $path = $request
            ->file('avatar')
            ->store('avatars', 'public');

        $user->avatar = Storage::url($path);
        $user->save();

        return response()->json([
            'avatar' => $user->avatar
        ]);
    }
    public function uploadCover(Request $request)
    {
        $request->validate([
            'cover' => 'required|image|max:4096'
        ]);

        $user = $request->user();

        $path = $request
            ->file('cover')
            ->store('covers', 'public');

        $user->cover_image = Storage::url($path);
        $user->save();

        return response()->json([
            'cover_image' => $user->cover_image
        ]);
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

    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6|confirmed'
        ]);

        $user = $request->user();

        if (
            !Hash::check(
                $request->old_password,
                $user->password
            )
        ) {
            return response()->json([
                'message' => 'Mật khẩu cũ không đúng'
            ], 422);
        }

        $user->password = Hash::make(
            $request->new_password
        );

        $user->save();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }

    public function orderDetail(Request $request, $id)
    {
        $order = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }
}
