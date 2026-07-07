import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("admin_user")
  );

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          minHeight: "100vh",
          background: "linear-gradient(180deg, #1e3a8a, #0f172a)",
          color: "#fff",
          padding: 16,
          boxShadow: "2px 0 10px rgba(0,0,0,0.15)",
        }}

      >
        <div
          onClick={() => navigate("/admin/dashboard")}
          style={menuStyle}
        >
          <h4 style={{ marginBottom: 20 }}>
            QUẢN LÍ MINIMART
          </h4>
        </div>

        {user?.role === "super_admin" && (
          <p
            onClick={() => navigate("/admin/branches")}
            style={menuStyle}
          >
            Chi nhánh
          </p>
        )}


        <p onClick={() => navigate("/products")} style={menuStyle}>
          Sản phẩm
        </p>

        <p onClick={() => navigate("/categories")} style={menuStyle}>
          Danh mục
        </p>
        <p onClick={() => navigate("admin/brands")} style={menuStyle}>
          Thương hiệu
        </p>


        <p onClick={() => navigate("/orders")} style={menuStyle}>
          Đơn hàng
        </p>

        <p onClick={() => navigate("/inventories")} style={menuStyle}>
          Tồn kho
        </p>

        <p onClick={() => navigate("/reports")} style={menuStyle}>
          Báo cáo
        </p>

        <p onClick={() => navigate("/user")} style={menuStyle}>
          Khách hàng
        </p>

        {user?.role === "super_admin" && (
          <p
            onClick={() =>
              navigate("/admin/conversations")
            }
            style={menuStyle}
          >
            Tin nhắn
          </p>
        )}

        {user?.role === "super_admin" && (
          <p
            onClick={() =>
              navigate("/admin/banners")
            }
            style={menuStyle}
          >
            Banner
          </p>
        )}

        <p onClick={() => navigate("/admin/contacts")} style={menuStyle}>
          Liên hệ
        </p>

        {user?.role === "super_admin" && (
  <p
    onClick={() =>
      navigate("/admin/store-info")
    }
    style={menuStyle}
  >
    Thông tin cửa hàng
  </p>
)}

        <p onClick={() => navigate("admin/employees")} style={menuStyle}>
          Nhân viên
        </p>


        <hr style={{ borderColor: "#334155" }} />

        <p onClick={logout} style={{ ...menuStyle, color: "#f87171" }}>
          Logout
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 24, background: "#f8fafc" }}>
        <Outlet />
      </div>
    </div>
  );
}

const menuStyle = {
  cursor: "pointer",
  padding: "8px 0",
};

export default AdminLayout;
