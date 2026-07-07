<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $message = mb_strtolower(trim($request->message));

        $message = mb_strtolower(trim($request->message));

        // Nếu khách muốn tìm sản phẩm
        if (
            str_contains($message, "tìm") ||
            str_contains($message, "có") ||
            str_contains($message, "mua")
        ) {

            $keyword = str_replace(
                ["tìm", "có", "mua", "không", "?"],
                "",
                $message
            );

            $keyword = trim($keyword);

            $products = Product::where("name", "like", "%{$keyword}%")
                ->where("active", 1)
                ->take(5)
                ->get();

            if ($products->isEmpty()) {
                return response()->json([
                    "reply" => "Xin lỗi, MINIMART hiện chưa có sản phẩm \"$keyword\"."
                ]);
            }

            $reply = "🔎 Đã tìm thấy " . $products->count() . " sản phẩm:\n\n";

            foreach ($products as $product) {
                $reply .= "🛒 {$product->name}\n";
                $reply .= "💰 " . number_format($product->final_price) . "đ\n";
                $reply .= "📦 Còn {$product->stock} sản phẩm\n\n";
            }

            return response()->json([
                "reply" => $reply
            ]);
        }

        $faq = [
            [
                "keys" => ["sản phẩm", "ban gi", "bán gì"],
                "reply" => "MINIMART hiện kinh doanh:\n• Bánh kẹo\n• Nước giải khát\n• Mì ăn liền\n•Đồ ăn nhanh"
            ],

            [
                "keys" => ["thanh toán", "vnpay", "cod"],
                "reply" => "MINIMART hỗ trợ:\n• Thanh toán khi nhận hàng (COD)\n• Thanh toán qua VNPay."
            ],

            [
                "keys" => ["đăng ký", "đăng kí"],
                "reply" => "Bạn nhấn nút Đăng ký ở góc trên bên phải và điền đầy đủ thông tin để tạo tài khoản."
            ],

            [
                "keys" => ["đăng nhập", "login"],
                "reply" => "Bạn nhập email hoặc số điện thoại cùng mật khẩu đã đăng ký."
            ],

            [
                "keys" => ["quên mật khẩu"],
                "reply" => "Bạn chọn Quên mật khẩu và nhập email để nhận hướng dẫn đặt lại mật khẩu nhé."
            ],

            [
                "keys" => ["đơn hàng"],
                "reply" => "Bạn vào mục Tài khoản → Đơn hàng để xem trạng thái đơn hàng."
            ],

            [
                "keys" => ["địa chỉ"],
                "reply" => "Bạn vào Tài khoản → Địa chỉ để thêm hoặc chỉnh sửa địa chỉ giao hàng."
            ],

            [
                "keys" => ["đổi trả"],
                "reply" => "MINIMART hỗ trợ đổi trả nếu sản phẩm bị lỗi hoặc giao sai."
            ],

            [
                "keys" => ["chi nhánh"],
                "reply" => "Bạn có thể chọn chi nhánh ngay trên website trước khi mua hàng."
            ],

            [
                "keys" => ["khuyến mãi"],
                "reply" => "Các chương trình khuyến mãi sẽ hiển thị trên trang chủ và trang sản phẩm."
            ],

            [
                "keys" => ["giờ mở cửa"],
                "reply" => "MINIMART phục vụ từ 7:00 đến 22:00 mỗi ngày."
            ],

            [
                "keys" => ["liên hệ"],
                "reply" => "Hotline: 1900 1234\nEmail: support@MINIMART.vn"
            ]
        ];

        foreach ($faq as $item) {
            foreach ($item["keys"] as $key) {
                if (str_contains($message, $key)) {
                    return response()->json([
                        "reply" => $item["reply"]
                    ]);
                }
            }
        }

        return response()->json([
            "reply" => "Xin lỗi, mình chỉ hỗ trợ các câu hỏi về sản phẩm, tài khoản, thanh toán, đơn hàng và địa chỉ."
        ]);
    }
}
