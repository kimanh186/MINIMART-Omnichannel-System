<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function generateQR(Request $req)
    {
        $req->validate([
            'amount' => 'required|numeric|min:1000',
            'order_id' => 'required'
        ]);
        $bankCode = "970422";
        $account = "1806808105";
        $accountName = "NGUYEN LE KIM ANH";
        $amount = $req->amount;
        $addInfo = "ORDER" . $req->order_id;
        $qrUrl = "https://img.vietqr.io/image/{$bankCode}-{$account}-compact.png"
            . "?amount={$amount}&addInfo={$addInfo}&accountName={$accountName}";

        return response()->json([
            'status' => true,
            'qr_url' => $qrUrl
        ]);
    }
    
}
