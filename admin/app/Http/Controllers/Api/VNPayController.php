<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class VNPayController extends Controller
{
    public function createPayment(Request $request)
    {
        $order = Order::find(
            $request->order_id
        );

        if ($order) {
            $order->source =
                $request->source;

            $order->save();
        }
        $vnp_TmnCode    = config('vnpay.vnp_TmnCode');
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');
        $vnp_Url        = config('vnpay.vnp_Url');
        $vnp_ReturnUrl  = config('vnpay.vnp_ReturnUrl');
        $vnp_IpnUrl     = config('vnpay.vnp_IpnUrl');

        $vnp_TxnRef = $request->order_id ?? time();
        $vnp_Amount = $request->amount * 100;

        $vnp_Params = [
            "vnp_Version"     => "2.1.0",
            "vnp_Command"     => "pay",
            "vnp_TmnCode"     => $vnp_TmnCode,
            "vnp_Amount"      => $vnp_Amount,
            "vnp_CurrCode"    => "VND",
            "vnp_TxnRef"      => $vnp_TxnRef,
            "vnp_OrderInfo"   => "Thanh toan don hang #$vnp_TxnRef",
            "vnp_OrderType"   => "billpayment",
            "vnp_Locale"      => "vn",
            "vnp_ReturnUrl"   => $vnp_ReturnUrl,
            "vnp_IpAddr"      => $request->ip(),
            "vnp_CreateDate"  => date('YmdHis'),
        ];

        // Bước tạo query + hash
        ksort($vnp_Params);
        $query = "";
        foreach ($vnp_Params as $key => $value) {
            $query .= urlencode($key) . "=" . urlencode($value) . "&";
        }

        $hashData = rtrim($query, "&");
        $vnpSecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        $paymentUrl = $vnp_Url . "?" . $hashData . "&vnp_SecureHash=" . $vnpSecureHash;

        return response()->json([
            'payment_url' => $paymentUrl
        ]);
    }

    // RETURN URL - user quay về POS
    public function returnPayment(Request $request)
    {
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');
        $inputData = $request->all();

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';

        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);

        ksort($inputData);

        $hashString = "";
        foreach ($inputData as $key => $value) {
            $hashString .= urlencode($key) . "=" . urlencode($value) . "&";
        }
        $hashString = rtrim($hashString, "&");

        $verify = hash_hmac('sha512', $hashString, $vnp_HashSecret);

        if ($verify === $vnp_SecureHash) {

            // 🔥 ---------- SỬA LỖI CHÍNH Ở ĐÂY ---------- 🔥
            if ($inputData['vnp_ResponseCode'] == "00") {

                // Lấy order ID chính là vnp_TxnRef
                $orderId = $inputData['vnp_TxnRef'];
                $order = \App\Models\Order::find($orderId);

                if ($order && $order->status !== 'paid') {
                    $order->status = 'paid';
                    $order->save();
                }

                if ($order->source === 'pos') {

                    return response()->make(
                        'Thanh toán thành công. Có thể đóng tab này.'
                    );
                }

                return redirect(
                    'http://localhost:5173/payment-success?orderId='
                        . $orderId
                );
            }
            // -------------------------------------------------

            return "Thanh toán thất bại hoặc bị hủy!";
        } else {
            return "Chữ ký không hợp lệ!";
        }
    }


    public function ipnHandler(Request $request)
    {
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');
        $inputData = $request->all();

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';

        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashString = urldecode(http_build_query($inputData));
        $verify = hash_hmac('sha512', $hashString, $vnp_HashSecret);

        if ($verify !== $vnp_SecureHash) {
            return response()->json(['RspCode' => '97']); // sai chữ ký
        }

        $orderId = $inputData['vnp_TxnRef'];
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['RspCode' => '01']); // order không tồn tại
        }

        // Dùng số tiền từ VNPay để kiểm chứng
        $amount = $inputData['vnp_Amount'] / 100;

        if ($amount != $order->total) {
            return response()->json(['RspCode' => '04']); // sai số tiền
        }

        // CHỈ TRẢ RESPONSE 00 KHI VNPAY XÁC NHẬN THÀNH CÔNG THẬT
        if ($inputData['vnp_ResponseCode'] == "00") {
            if ($order->status != 'paid') {
                $order->status = 'paid';
                $order->save();
            }

            return response()->json(['RspCode' => '00']);
        }

        return response()->json(['RspCode' => '00']); // thanh toán thất bại
    }
}
