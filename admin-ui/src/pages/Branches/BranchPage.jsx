import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPen, FaLock, FaUnlock } from "react-icons/fa";

export default function BranchPage() {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();



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
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");

      await axios.patch(
        `http://127.0.0.1:8000/api/admin/branches/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadBranches();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  return (
    <div className="order-page">
      <h2 className="report-title">
        DANH SÁCH CHI NHÁNH
      </h2>

      <div className="admin-toolbar">
        <div className="search-box search-grid">
          <div className="search-item">
            <label>&nbsp;</label>

            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                navigate("/admin/branches/create")
              }
            >
              + Thêm chi nhánh
            </button>
          </div>
        </div>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên chi nhánh</th>
            <th>Địa chỉ</th>
            <th>Lat</th>
            <th>Lng</th>
            <th>Số điện thoại</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {branches.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="text-center text-muted"
              >
                Không có chi nhánh
              </td>
            </tr>
          )}

          {branches.map((branch) => (
            <tr key={branch.id}>
              <td>{branch.id}</td>

              <td className="product-name">
                {branch.name}
              </td>

              <td>{branch.address}</td>
              <td>{branch.latitude}</td>
              <td>{branch.longitude}</td>

              <td>{branch.phone}</td>

              <td>
                <span
                  className={
                    branch.active
                      ? "status-active"
                      : "status-inactive"
                  }
                >
                  {branch.active
                    ? "Hoạt động"
                    : "Đã khóa"}
                </span>
              </td>

              <td>
                <div className="report-actions">
                  <button
                    className="btn-icon btn-edit"
                    title="Sửa"
                    onClick={() =>
                      navigate(
                        `/admin/branches/${branch.id}/edit`
                      )
                    }
                  >
                    <FaPen />
                  </button>

                  <button
                    className="btn-icon btn-delete"
                    title="Khóa / Mở"
                    onClick={() =>
                      toggleStatus(branch.id)
                    }
                  >
                    {branch.active ? (
                      <FaLock />
                    ) : (
                      <FaUnlock />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

