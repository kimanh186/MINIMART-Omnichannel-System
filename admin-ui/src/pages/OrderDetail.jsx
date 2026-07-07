import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../api/adminOrder";
import { toast } from "react-toastify";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const res = await getOrderById(id);
    setOrder(res.data);
  };

  const handleChangeStatus = async (status) => {
    const toastId = toast.loading("Đang cập nhật trạng thái...");

    try {
      await updateOrderStatus(id, status);

      toast.update(toastId, {
        render: "Cập nhật trạng thái đơn hàng thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchOrder();
    } catch (err) {
      toast.update(toastId, {
        render:
          err.response?.data?.message ||
          "Cập nhật trạng thái thất bại ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  if (!order) return <p>Loading...</p>;

  const subtotal = order.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const vat = subtotal * 0.1;
  const grandTotal = subtotal + vat;

  const formatMoney = (n) => n.toLocaleString("vi-VN") + "đ";

  const paymentText = {
    cash: "Tiền mặt",
    card: "Thẻ / QR",
    ewallet: "Ví điện tử",
    bank: "Chuyển khoản",
  };

  const statusText = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    cancelled: "Hủy",
  };

  return (
    <div className="order-page">
      <h2 className="order-title">Hóa đơn đơn hàng #{order.id}</h2>

      <Link to="/orders" className="btn-back">
        ← Quay lại danh sách
      </Link>

      <div className="order-card">
        {/* THÔNG TIN */}
        <div className="order-info">
          <div>
            <p><b>Khách hàng:</b> {order.customer_name || "Khách vãng lai"}</p>
            <p><b>SĐT:</b> {order.customer_phone || "-"}</p>
            <p><b>Ngày tạo:</b> {new Date(order.created_at).toLocaleString("vi-VN")}</p>
          </div>

          <div>
            <p><b>Nhân viên:</b> {order.employee?.full_name || "Không có"}</p>
            <p>
              <b>Phương thức thanh toán:</b>{" "}
              <span className="text-green">
                {paymentText[order.payment_method]}
              </span>
            </p>
          </div>
        </div>
        <div className="order-info">
          <div>
            <p><b>Người nhận:</b> {order.receiver_name}</p>
            <p><b>SĐT nhận:</b> {order.receiver_phone}</p>

            <p>
              <b>Địa chỉ giao:</b><br />

              {order.shipping_address},
              {" "}
              {order.shipping_ward},
              {" "}
              {order.shipping_district},
              {" "}
              {order.shipping_city}
            </p>
          </div>
        </div>

        {/* TRẠNG THÁI */}
        <div className="order-status">
          <p>
            <b>Trạng thái đơn hàng:</b>{" "}
            <span className="text-green">
              {statusText[order.status]}
            </span>
          </p>

          <select
            value={order.status}
            onChange={(e) => handleChangeStatus(e.target.value)}
          >
            <option value="pending">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="cancelled">Hủy</option>
          </select>
        </div>

        {/* GIỎ HÀNG */}
        <h3 className="cart-title">Sản phẩm</h3>

        <div className="cart-box">
          {order.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <p className="product-name">{item.product?.name}</p>
                <p className="price">{formatMoney(item.price)}</p>
              </div>

              <div className="qty">SL: {item.quantity}</div>

              <div className="total">
                {formatMoney(item.price * item.quantity)}
              </div>
            </div>
          ))}

          <div className="cart-total">
            <p><b>Tạm tính:</b> {formatMoney(subtotal)}</p>
            <p><b>VAT (10%):</b> {formatMoney(vat)}</p>
            <p className="grand-total">
              Tổng thanh toán: {formatMoney(grandTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
