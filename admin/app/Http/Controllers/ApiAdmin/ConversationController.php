<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    private function checkSuperAdmin(Request $request)
{
    if ($request->user()->role !== 'super_admin') {
        abort(
            403,
            'Bạn không có quyền quản lý tin nhắn.'
        );
    }
}
    public function index(Request $request)
    {
        $this->checkSuperAdmin($request);

        $conversations = Conversation::with([
            'customer',
            'latestMessage',
        ])
            ->withCount([
                'messages as unread_count' => function ($query) {
                    $query
                        ->where('sender_type', 'customer')
                        ->where('is_read', false);
                }
            ])
            ->orderByDesc(
                Message::select('created_at')
                    ->whereColumn(
                        'conversation_id',
                        'conversations.id'
                    )
                    ->latest()
                    ->limit(1)
            )
            ->get();

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    // XEM CHI TIẾT CHAT
    public function show(Request $request, $id)
    {
        $this->checkSuperAdmin($request);

        $conversation = Conversation::with([
            'customer',
            'messages' => function ($query) {
                $query->orderBy(
                    'created_at',
                    'asc'
                );
            }
        ])->findOrFail($id);

        Message::where(
            'conversation_id',
            $conversation->id
        )
            ->where('sender_type', 'customer')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
            ]);

        return response()->json([
            'success' => true,
            'data' => $conversation,
        ]);
    }

    // NHÂN VIÊN TRẢ LỜI
    public function reply(Request $request, $id)
    {
        $this->checkSuperAdmin($request);
        
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $employee = $request->user();

        $conversation = Conversation::findOrFail($id);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'employee',
            'sender_id' => $employee->id,
            'message' => $request->message,
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trả lời thành công',
            'data' => $message,
        ], 201);
    }
}