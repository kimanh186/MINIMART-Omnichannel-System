import { useEffect, useState } from "react";
import { getOrders } from "../api/adminOrder";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSearch } from "react-icons/fa";
import axiosClient from "../api/axiosClient";

export default function OrderPage() {
  const user = JSON.parse(
    localStorage.getItem("admin_user")
  );
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    employee: "",
    order_type: "",
    start_date: "",
    end_date: "",
    payment_method: "",
    status: "",
    branch_id:
      user?.role === "branch_manager"
        ? user.branch_id
        : ""
  });

  const fetchOrders = async () => {
    try {
      const res = await getOrders({
        ...filters,
        page,
      });

      setOrders(res.data.data || []);
      setLastPage(res.data.last_page || 1);

    } catch {
      alert("Lấy đơn hàng thất bại");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  useEffect(() => {
    if (user?.role === "branch_manager") {
      setBranches([
        {
          id: user.branch_id,
          name: user.branch?.name,
        },
      ]);
    } else {
      axiosClient
        .get("/admin/branches")
        .then((res) => {
          setBranches(res.data);
        });
    }
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };


  const renderPayment = (m) => {
    switch (m) {
      case "cash": return "Tiền mặt";
      case "vnpay": return "VNPAY";
      case "card": return "Thẻ / QR";
      case "bank": return "Chuyển khoản";
      default: return "-";
    }
  };

  const renderStatus = (s) => {
    switch (s) {
      case "pending": return "Chờ xử lý";
      case "paid": return "Đã thanh toán";
      case "cancelled": return "Đã hủy";
      default: return s;
    }
  };

  return (
    <div className="order-page">
      <h2 className="report-title">DANH SÁCH ĐƠN HÀNG</h2>

      {/* TOOLBAR – dùng chung */}
      <div className="admin-toolbar">
        <form onSubmit={handleSubmit} className="search-box search-grid">
          <div className="search-item">
            <label>ID / SĐT khách hàng</label>
            <input
              name="keyword"
              placeholder="Nhập ID hoặc SĐT"
              value={filters.keyword}
              onChange={handleChange}
            />
          </div>
          <div className="search-item">
            <label>Loại đơn</label>

            <select
              name="order_type"
              value={filters.order_type || ""}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              <option value="online">Online</option>
              <option value="pos">POS</option>
            </select>
          </div>

          <div className="search-item">
            <label>Tên nhân viên</label>
            <input
              name="employee"
              placeholder="Nhập tên nhân viên"
              value={filters.employee}
              onChange={handleChange}
            />
          </div>
          <div className="search-item">
            <label>Trạng thái</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="paid">Đã thanh toán</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="search-item">
            <label>Từ ngày</label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="search-item">
            <label>Đến ngày</label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleChange}
            />
          </div>

          <div className="search-item">
            <label>Thanh toán</label>
            <select
              name="payment_method"
              value={filters.payment_method}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              <option value="cash">Tiền mặt</option>
              <option value="vnpay">VNPAY</option>
            </select>
          </div>
          <div className="search-item">
            <label>Chi nhánh</label>

            <select
              name="branch_id"
              value={filters.branch_id}
              onChange={handleChange}
            >
              {user?.role === "super_admin" && (
                <option value="">
                  Tất cả chi nhánh
                </option>
              )}

              {branches.map((b) => (
                <option
                  key={b.id}
                  value={b.id}
                >
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-item search-btn">
            <label>&nbsp;</label>
            <button className="btn-primary">
              <FaSearch /> Tìm / Lọc
            </button>
          </div>
        </form>
      </div>

      {/* TABLE – dùng chung */}
      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Nhân viên</th>
              <th>Tổng tiền</th>
              <th>Ngày tạo</th>
              <th>Chi nhánh</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th width="120">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  Không có đơn hàng
                </td>
              </tr>
            )}

            {orders.map((o) => (
              <tr key={o.id} className="hover-row">
                <td>{o.id}</td>
                <td>{o.customer_name || "-"}</td>
                <td>{o.customer_phone || "-"}</td>
                <td
                  className="product-name"
                  style={{
                    color: o.employee ? "#000" : "#0284c7",
                    fontWeight: "200"
                  }}
                >
                  {o.employee?.full_name || "Đơn ONLINE"}
                </td>                <td>
                  {o.total?.toLocaleString()} đ
                </td>
                <td>
                  {new Date(o.created_at).toLocaleString("vi-VN")}
                </td>
                <td>{o.branch?.name || "-"}</td>
                <td>{renderPayment(o.payment_method)}</td>
                <td>
                  <span className={`order-status status-${o.status}`}>
                    {renderStatus(o.status)}
                  </span>
                </td>
                <td>
                  <div className="report-actions">

                    <button
                      className="btn-icon"
                      title="Xem chi tiết"
                      onClick={() => navigate(`/orders/${o.id}`)}
                    >
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            &laquo;
          </button>

          {Array.from({ length: lastPage }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
