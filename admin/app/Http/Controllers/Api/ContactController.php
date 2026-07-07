<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'email' => 'required|email|max:255',

            'phone' => [
                'required',
                'regex:/^0[0-9]{9}$/',
            ],

            'branch_id' => [
                'required',
                'exists:branches,id',
            ],

            'message' => 'required|string',
        ], [
            'name.required' =>
                'Vui lòng nhập tên.',

            'email.required' =>
                'Vui lòng nhập email.',

            'email.email' =>
                'Email không đúng định dạng.',

            'phone.required' =>
                'Vui lòng nhập số điện thoại.',

            'phone.regex' =>
                'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0.',

            'branch_id.required' =>
                'Vui lòng chọn chi nhánh.',

            'branch_id.exists' =>
                'Chi nhánh không tồn tại.',

            'message.required' =>
                'Vui lòng nhập nội dung liên hệ.',
        ]);

        $contact = Contact::create([
            'name' => $validated['name'],

            'email' => $validated['email'],

            'phone' => $validated['phone'],

            'branch_id' =>
                $validated['branch_id'],

            'message' =>
                $validated['message'],

            'status' => 'pending',
        ]);

        return response()->json([
            'message' =>
                'Gửi liên hệ thành công!',

            'data' => $contact,
        ], 201);
    }
}