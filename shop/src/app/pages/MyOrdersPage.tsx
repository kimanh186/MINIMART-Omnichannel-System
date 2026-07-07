import { useEffect, useState } from "react";
import { getMyOrders } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function MyOrdersPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const data = await getMyOrders(token);

            setOrders(data);
        } catch (err) {
            console.log(err);
        }
    };

    const getStatus = (status: string) => {
        switch (status) {
            case "paid":
                return "Đã thanh toán";
            case "pending":
                return "Chờ thanh toán";
            case "cancelled":
                return "Đã hủy";
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-6">
                    Đơn hàng của tôi
                </h1>

                {orders.length === 0 && (
                    <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
                        Bạn chưa có đơn hàng nào.
                    </div>
                )}

                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-2xl shadow p-6 mb-5"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-lg">
                                    Đơn hàng #{order.id}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Ngày đặt:
                                    {" "}
                                    {new Date(
                                        order.created_at
                                    ).toLocaleString("vi-VN")}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                            >
                                {getStatus(order.status)}
                            </span>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-500 text-sm">
                                Tổng tiền
                            </p>

                            <p className="text-red-600 text-2xl font-bold">
                                {Number(order.total).toLocaleString()}đ
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate(`/orders/${order.id}`)
                            }
                            className="
    mt-5
    bg-sky-100
    text-sky-700
    hover:bg-sky-200
    px-5
    py-2
    rounded-xl
    font-medium
    transition
"                   >
                            Xem chi tiết
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}