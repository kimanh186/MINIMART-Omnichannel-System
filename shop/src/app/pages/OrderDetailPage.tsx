import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetailPage() {
    const { id } = useParams();

    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `http://127.0.0.1:8000/api/customer/orders/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        setOrder(data);
    };

    if (!order) {
        return <h2>Đang tải...</h2>;
    }

    const handleCancelOrder = async () => {
        const confirmCancel = window.confirm(
            "Bạn có chắc muốn hủy đơn hàng này không?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://127.0.0.1:8000/api/customer/orders/${id}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(
                    data.message ||
                    "Không thể hủy đơn hàng!"
                );

                return;
            }

            alert("Hủy đơn hàng thành công!");

            await loadOrder();
        } catch (error) {
            console.error(
                "Lỗi hủy đơn hàng:",
                error
            );

            alert("Hủy đơn hàng thất bại!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">

                <h1 className="text-3xl font-bold mb-6">
                    Chi tiết đơn hàng #{order.id}
                </h1>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="text-gray-500 text-sm">
                            Trạng thái đơn hàng
                        </p>

                        <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium
                    ${order.status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                        >
                            {order.status === "paid"
                                ? "Đã thanh toán"
                                : order.status === "pending"
                                    ? "Chờ thanh toán"
                                    : order.status === "cancelled"
                                        ? "Đã hủy"
                                        : order.status}
                        </span>
                    </div>


                    <div>
                        <p className="text-gray-500 text-sm">
                            Phương thức thanh toán
                        </p>

                        <p className="font-semibold">
                            {order.payment_method === "cash"
                                ? "Tiền mặt"
                                : order.payment_method === "vnpay"
                                    ? "VNPay"
                                    : order.payment_method}
                        </p>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <h2 className="text-lg font-bold mb-3">
                        Địa chỉ giao hàng
                    </h2>

                    <p>
                        <b>Người nhận:</b> {order.receiver_name}
                    </p>

                    <p>
                        <b>Số điện thoại:</b> {order.receiver_phone}
                    </p>

                    <p>
                        <b>Địa chỉ:</b>{" "}
                        {[
                            order.shipping_address,
                            order.shipping_ward,
                            order.shipping_district,
                            order.shipping_city,
                        ]
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <p className="text-gray-500 text-sm">
                        Tổng tiền
                    </p>

                    <p className="text-3xl font-bold text-blue-700">
                        {Number(order.total).toLocaleString()}đ
                    </p>
                </div>
                {order.status === "pending" && (
                    <div className="mb-6">
                        <button
                            onClick={handleCancelOrder}
                            className="
                bg-red-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                hover:bg-red-700
            "
                        >
                            Hủy đơn hàng
                        </button>
                    </div>
                )}

                <h2 className="text-xl font-bold mb-4">
                    Danh sách sản phẩm
                </h2>

                <div className="space-y-3">
                    {order.items.map((item: any) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border rounded-xl p-4"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.product?.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Số lượng: {item.quantity}
                                </p>
                            </div>

                            <div className="text-blue-600 font-semibold">
                                x{item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}