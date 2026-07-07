import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getCustomerById } from "../api/adminCustomer";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getCustomerById(id).then((res) => {
      setUser(res.data.user);
      setOrders(res.data.orders);
    });
  }, [id]);


  if (!user) return <div className="admin-page">Đang tải...</div>;

  const renderStatusVN = (status) => {
    switch (status) {
      case "paid":
        return { text: "Đã thanh toán", className: "text-green" };
      case "pending":
        return { text: "Chờ thanh toán", className: "text-orange " };
      case "cancelled":
        return { text: "Đã hủy", className: "text-red font-bold" };
      case "failed":
        return { text: "Thanh toán thất bại", className: "text-red " };
      default:
        return { text: status, className: "text-muted" };
    }
  };
  const renderPaymentMethodVN = (method) => {
    switch (method) {
      case "cash":
        return "Tiền mặt";
      case "vnpay":
        return "VNPay";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      case "cod":
        return "Thanh toán khi nhận hàng";
      default:
        return method || "—";
    }
  };

  return (
    <div className="order-page">
      <h2 className="admin-title">
        KHÁCH HÀNG: {user.name}
      </h2>
      <Link to="/user" className="btn-back">
        ← Quay lại danh sách
      </Link>

      {/* THÔNG TIN KHÁCH */}
      <div className="info-box">
        <div className="info-grid">
          <p><b>Điện thoại:</b> {user.phone || "—"}</p>
          <p>
            <b>Điểm:</b>{" "}
            <span className="text-green font-bold">
              {user.points ?? 0}
            </span>
          </p>
          <p>
            <b>Hạng:</b>{" "}
            <span className="font-bold">
              {user.customer_level}
            </span>
          </p>
        </div>
      </div>

      {/* ĐƠN HÀNG */}
      <h3 className="section-title">ĐƠN HÀNG ĐÃ MUA</h3>

      {orders.length === 0 ? (
        <p className="text-muted">Khách hàng chưa có đơn hàng nào.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày mua</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Xem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="text-center">#{o.id}</td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td className="text-right text-green font-bold">
                  {Number(o.total).toLocaleString()} đ
                </td>
                <td className="text-center">
                  {renderPaymentMethodVN(o.payment_method)}
                </td>

                <td className="text-center">
                  {(() => {
                    const s = renderStatusVN(o.status);
                    return <span className={s.className}>{s.text}</span>;
                  })()}
                </td>

                <td className="text-center">
                  <button
                    className="btn-link"
                    onClick={() => navigate(`/orders/${o.id}`)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="form-actions">
        <button
          className="btn-secondary"
          onClick={() => navigate("/admin/customers")}
        >
          ← Quay lại danh sách
        </button>
      </div>
    </div>
  );
}
