import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../api/adminCategory";
import { useNavigate } from "react-router-dom";
import { FaPen, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function CategoryPage() {
  const user = JSON.parse(
    localStorage.getItem("admin_user")
  );
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await getCategories(keyword, page);

      setCategories(res.data.data || []);
      setLastPage(res.data.last_page || 1);

    } catch {
      toast.error("Không có quyền truy cập");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [keyword, page]);

  const handleDelete = async (id) => {
    const confirmToast = toast.info(
      <div>
        <p>Bạn chắc chắn muốn xóa danh mục này?</p>
        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <button
            className="btn-primary"
            onClick={async () => {
              toast.dismiss(confirmToast);

              const toastId = toast.loading("Đang xóa danh mục...");

              try {
                await deleteCategory(id);
                toast.update(toastId, {
                  render: "Xóa danh mục thành công ",
                  type: "success",
                  isLoading: false,
                  autoClose: 2000,
                });
                fetchCategories();
              } catch {
                toast.update(toastId, {
                  render: "Xóa danh mục thất bại ",
                  type: "error",
                  isLoading: false,
                  autoClose: 3000,
                });
              }
            }}
          >
            Xóa
          </button>

          <button
            className="btn-secondary"
            onClick={() => toast.dismiss(confirmToast)}
          >
            Hủy
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <div className="order-page">
      <h2 className="report-title">DANH SÁCH DANH MỤC</h2>

      {/* TOOLBAR */}
      <div className="admin-toolbar">
        <form className="search-box search-grid">
          <div className="search-item">
            <label>Tên danh mục</label>
            <input
              placeholder="Nhập tên danh mục..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="search-item">
            <label>&nbsp;</label>
            {user?.role === "super_admin" && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate("/categories/create")}
              >
                + Thêm danh mục
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên danh mục</th>
            {user?.role === "super_admin" && (
              <th>Hành động</th>
            )}
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                Không có danh mục
              </td>
            </tr>
          )}

          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                {c.image ? (
                  <img
  src={`${BACKEND_URL}/storage/${c.image}`}
  alt={c.name}
  className="product-img"
/>
                ) : (
                  "-"
                )}
              </td>

              <td className="product-name">
                {c.name}
              </td>
              {user?.role === "super_admin" && (
                <td>
                  <div className="report-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() =>
                        navigate(`/categories/${c.id}/edit`)
                      }
                    >
                      <FaPen />
                    </button>

                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(c.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              )}
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

export default CategoryPage;
