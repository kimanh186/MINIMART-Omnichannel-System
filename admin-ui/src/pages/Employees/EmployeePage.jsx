import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminEmployee from "../../api/adminEmployee";
import { FaPen, FaTrash, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

function EmployeePage() {



  const user = JSON.parse(
    localStorage.getItem("admin_user")
  );

  const [branchId, setBranchId] = useState(
    user?.role === "branch_manager"
      ? String(user.branch_id)
      : ""
  );


  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [meta, setMeta] = useState({});

  const fetchEmployees = async () => {
    const res = await adminEmployee.getAll({
      keyword,
      branch_id: branchId,
      page,
    });

    setEmployees(res.data.data || []);
    setMeta(res.data.meta || {});
    setLastPage(res.data.meta?.last_page || 1);
  };

  const ROLE_LABELS = {
    super_admin: {
      label: "Quản trị viên hệ thống",
      class: "text-red",
    },

    branch_manager: {
      label: "Quản lý chi nhánh",
      class: "text-blue",
    },

    staff: {
      label: "Nhân viên",
      class: "text-gray",
    },
  };
  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [keyword, branchId, page]);

  const loadBranches = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/branches",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBranches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p>Bạn có chắc muốn xóa nhân viên này?</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              className="btn-primary"
              onClick={async () => {
                closeToast();

                const toastId = toast.loading("Đang xóa nhân viên...");

                try {
                  await adminEmployee.delete(id);
                  toast.update(toastId, {
                    render: "Đã xóa nhân viên thành công",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                  });
                  fetchEmployees();
                } catch {
                  toast.update(toastId, {
                    render: "Xóa thất bại ",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                  });
                }
              }}
            >
              Xóa
            </button>

            <button className="btn-secondary" onClick={closeToast}>
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };


  return (
    <div className="order-page">
      <h2 className="report-title">DANH SÁCH NHÂN VIÊN</h2>


      {/* TOOLBAR – giống Category / Customer */}
      <div className="admin-toolbar">
        <form className="search-box search-grid">
          <div className="search-item">
            <label>Tên / Username</label>
            <input
              placeholder="Nhập tên hoặc username..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="search-item">
            <label>Chi nhánh</label>

            <select
              value={branchId}
              onChange={(e) => {
                setBranchId(e.target.value);
                setPage(1);
              }}
              disabled={
                user?.role === "branch_manager"
              }
            >
              {user?.role === "super_admin" && (
                <option value="">
                  Tất cả chi nhánh
                </option>
              )}

              {branches
                .filter((b) =>
                  user?.role === "branch_manager"
                    ? b.id === user.branch_id
                    : true
                )
                .map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                  >
                    {b.name}
                  </option>
                ))}
            </select>
          </div>


          <div className="search-item">
            <label>&nbsp;</label>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  navigate("/admin/employees/create")
                }
              >
                + Thêm nhân viên
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  navigate("/admin/attendance")
                }
              >
                Danh sách chấm công
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="result-count">
        {keyword || branchId
          ? `Tìm thấy ${employees.length} nhân viên`
          : `Tổng cộng ${meta.total || employees.length} nhân viên`}
      </div>

      {/* TABLE – giống Category / Customer */}
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Họ tên</th>
            <th>Username</th>
            <th>Vai trò</th>
            <th>Chi nhánh</th>
            <th>Loại NV</th>
            <th>Lương</th>
            <th>BHXH</th>
            <th>Hành động</th>
          </tr>
        </thead>


        <tbody>
          {employees.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">                Không có nhân viên
              </td>
            </tr>
          )}

          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>
                {emp.avatar ? (
                  <img
                    src={`http://localhost:8000/storage/${emp.avatar}`}
                    alt="avatar"
                    className="avatar-img"
                  />
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td className="product-name">{emp.full_name}</td>
              <td>{emp.username}</td>
              <td>
                <span className={ROLE_LABELS[emp.role]?.class}>
                  {ROLE_LABELS[emp.role]?.label || emp.role}
                </span>
              </td>
              <td>
                <span className="branch-badge">
                  {emp.branch?.name || "Chưa phân chi nhánh"}
                </span>
              </td>

              <td>
                {emp.employment_type === "full_time"
                  ? "Toàn thời gian"
                  : "Bán thời gian"}
              </td>

              <td className="text-right">
                {emp.employment_type === "part_time"
                  ? Number(
                    emp.salary_per_hour || 0
                  ).toLocaleString()
                  : Number(
                    emp.salary_per_month || 0
                  ).toLocaleString()}
                ₫
              </td>

              <td>
                {emp.participate_insurance
                  ? "Có"
                  : "Không"}
              </td>

              <td>
                <div className="report-actions">
                  <button
                    className="btn-icon btn-attendance"
                    title="Chấm công"
                    onClick={() =>
                      navigate(`/admin/attendance?employee=${emp.id}`)
                    }
                  >
                    <FaClock />
                  </button>
                  {/* Xem bảng lương */}
                  <button
                    className="btn-icon btn-payroll"
                    title="Xem bảng lương"
                    onClick={() => navigate(`/admin/payroll/${emp.id}`)}
                  >
                    <FaMoneyBillWave />
                  </button>

                  {/* Sửa */}
                  <button
                    className="btn-icon btn-edit"
                    title="Sửa nhân viên"
                    onClick={() => navigate(`/admin/employees/${emp.id}/edit`)}
                  >
                    <FaPen />
                  </button>

                  {/* Xóa */}
                  <button
                    className="btn-icon btn-delete"
                    title="Xóa nhân viên"
                    onClick={() => handleDelete(emp.id)}
                  >
                    <FaTrash />
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
  );
}

export default EmployeePage;
