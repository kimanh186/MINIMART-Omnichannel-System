<?php

namespace App\Http\Controllers\ApiAdmin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    
    public function index(Request $request)
    {
        $query = Contact::with('branch');

        $user = $request->user();

        if ($user->role === 'branch_manager') {
            $query->where(
                'branch_id',
                $user->branch_id
            );
        }

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->status
            );
        }

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->where(
                    'name',
                    'like',
                    "%{$keyword}%"
                )
                ->orWhere(
                    'email',
                    'like',
                    "%{$keyword}%"
                )
                ->orWhere(
                    'phone',
                    'like',
                    "%{$keyword}%"
                )
                ->orWhere(
                    'message',
                    'like',
                    "%{$keyword}%"
                );
            });
        }

        $contacts = $query
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($contacts);
    }

    public function show(Request $request, $id)
    {
        $query = Contact::with('branch');

        $user = $request->user();

        if ($user->role === 'branch_manager') {
            $query->where(
                'branch_id',
                $user->branch_id
            );
        }

        $contact = $query->findOrFail($id);

        return response()->json($contact);
    }

    public function updateStatus(
        Request $request,
        $id
    ) {
        $request->validate([
            'status' =>
                'required|in:pending,resolved',
        ]);

        $query = Contact::query();

        $user = $request->user();

        if ($user->role === 'branch_manager') {
            $query->where(
                'branch_id',
                $user->branch_id
            );
        }

        $contact = $query->findOrFail($id);

        $contact->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' =>
                'Cập nhật trạng thái thành công!',
            'data' => $contact,
        ]);
    }

    public function destroy(
        Request $request,
        $id
    ) {
        $query = Contact::query();

        $user = $request->user();

        if ($user->role === 'branch_manager') {
            $query->where(
                'branch_id',
                $user->branch_id
            );
        }

        $contact = $query->findOrFail($id);

        $contact->delete();

        return response()->json([
            'message' =>
                'Xóa liên hệ thành công!',
        ]);
    }
}