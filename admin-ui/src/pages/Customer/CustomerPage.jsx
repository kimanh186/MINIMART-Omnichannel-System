import { useEffect, useState } from "react";
import { getCustomers, deleteCustomer } from "../api/adminCustomer";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await getCustomers({
      keyword,
      page,
    });

    setCustomers(res.data.data || []);
    setPage(res.data.current_page || 1);
    setLastPage(res.data.last_page || 1);
    setTotal(res.data.total || 0);
  };

  useEffect(() => {
    fetchData();
  }, [keyword, page]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa khách hàng này?");
    if (!confirm) return;

    const toastId = toast.loading("Đang xóa khách hàng...");

    try {
      await deleteCustomer(id);

      toast.update(toastId, {
        render: "Xóa khách hàng thành công 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchData();
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Xóa khách hàng thất bại ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  const renderLevel = (level) => {
    switch (level) {
      case "Kim cương":
        return <span className="level-diamond">💎 Kim cương</span>;
      case "Vàng":
        return <span className="level-gold">🥇 Vàng</span>;
      case "Bạc":
        return <span className="level-silver">🥈 Bạc</span>;
      default:
        return <span className="level-normal">Thường</span>;
    }
  };

  return (
    <div className="order-page">
      <h2 className="report-title">DANH SÁCH KHÁCH HÀNG</h2>

      {/* SEARCH */}
      <div className="admin-toolbar">
        <form className="search-item">
          <label>Tên / Email / SĐT</label>
          <input
            placeholder="Nhập từ khóa..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }} />
        </form>
      </div>
      <div className="result-count">
        {keyword
          ? `Tìm thấy ${customers.length} khách hàng`
          : `Tổng cộng ${total} khách hàng`}
      </div>

      {/* TABLE */}
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Nhóm KH</th>
            <th>SĐT</th>
            <th>Điểm</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
          )}

          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td className="font-bold">{c.name}</td>
              <td>{renderLevel(c.customer_level)}</td>
              <td>{c.phone || "—"}</td>
              <td className="text-green font-bold">{c.points ?? 0}</td>
              <td>
                <div className="report-actions">
                  <button
                    className="btn-icon btn-view"
                    title="Xem"
                    onClick={() => navigate(`/user/${c.id}`)}
                  >
                    <FaEye />
                  </button>

                  <button
                    className="btn-icon btn-edit"
                    title="Sửa"
                    onClick={() => navigate(`/user/${c.id}/edit`)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="btn-icon btn-delete"
                    title="Xóa"
                    onClick={() => handleDelete(c.id)}
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
