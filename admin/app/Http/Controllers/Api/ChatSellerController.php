<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatSellerController extends Controller
{
    // LẤY CUỘC TRÒ CHUYỆN CỦA KHÁCH
    public function show(Request $request)
    {
        $user = $request->user();

        $conversation = Conversation::with([
            'messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }
        ])
            ->where('customer_id', $user->id)
            ->first();

        if (!$conversation) {
            return response()->json([
                'success' => true,
                'data' => null,
                'messages' => [],
            ]);
        }

        Message::where(
            'conversation_id',
            $conversation->id
        )
            ->where('sender_type', 'employee')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
            ]);

        return response()->json([
            'success' => true,
            'data' => $conversation,
            'messages' => $conversation->messages,
        ]);
    }

    // KHÁCH GỬI TIN NHẮN
    public function send(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $user = $request->user();

        $conversation = Conversation::firstOrCreate(
            [
                'customer_id' => $user->id,
            ],
            [
                'status' => 'open',
            ]
        );

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'customer',
            'sender_id' => $user->id,
            'message' => $request->message,
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gửi tin nhắn thành công',
            'data' => $message,
        ], 201);
    }
}