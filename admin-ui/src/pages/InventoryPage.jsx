import { useEffect, useState } from "react";
import { getInventories, deleteInventory } from "../api/adminInventory";
import axiosClient from "../api/axiosClient";
import { FaEye, FaTrash, FaPlus, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [branchId, setBranchId] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("admin_user")
  );

  const fetchData = async () => {
    try {
      const res = await getInventories({
        keyword,
        expired_date: expiredDate,
        branch_id: branchId,
        page,
      });

      setItems(res.data.data || []);
      setPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);

    } catch {
      toast.error("Không tải được danh sách tồn kho");
    }
  };

  useEffect(() => {
    fetchData();
  }, [keyword, expiredDate, branchId, page]);

  useEffect(() => {
    axiosClient.get("/admin/branches").then((res) => {

      if (user?.role === "branch_manager") {

        const currentBranch =
          res.data.find(
            b => b.id === user.branch_id
          );

        setBranches(
          currentBranch
            ? [currentBranch]
            : []
        );

        setBranchId(
          String(user.branch_id)
        );

      } else {

        setBranches(res.data);

      }

    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tồn kho này?")) {
      return;
    }

    const toastId = toast.loading("Đang xóa tồn kho...");

    try {
      await deleteInventory(id);

      toast.update(toastId, {
        render: "Xóa tồn kho thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchData();
    } catch (err) {
      toast.update(toastId, {
        render:
          err.response?.data?.message ||
          "Xóa tồn kho thất bại",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const renderStatus = (item) => {
    if (item.stock_quantity === 0) {
      return <span className="text-red">Hết hàng</span>;
    }

    if (item.stock_quantity <= 10) {
      return <span className="text-yellow">Sắp hết</span>;
    }

    return <span className="text-green">Còn hàng</span>;
  };

  return (
    <div className="order-page">
      <h2 className="report-title">
        DANH SÁCH TỒN KHO
      </h2>

      <div className="admin-toolbar">
        <div className="search-item">
          <label>Từ khóa</label>

          <input
            placeholder="Tên sản phẩm / SKU"
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
          >
            {user?.role === "super_admin" && (
              <option value="">
                Tất cả chi nhánh
              </option>
            )}

            {branches.map((branch) => (
              <option
                key={branch.id}
                value={branch.id}
              >
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="report-filter">
          <label>Hạn sử dụng</label>

          <input
            type="date"
            value={expiredDate}
            onChange={(e) => {
              setBranchId(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <button
          className="btn-primary"
          onClick={() =>
            navigate("/inventories/create")
          }
        >
          <FaPlus /> Thêm tồn kho
        </button>

        <button
          className="btn-primary"
          onClick={() =>
            navigate("/inventories/print")
          }
        >
          <FaPrint /> In tồn kho
        </button>
      </div>

      {(keyword || expiredDate || branchId) && (
        <div className="result-count">
          Tìm thấy {items.length} tồn kho
        </div>
      )}

      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Chi nhánh</th>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Tồn kho</th>
              <th>Đơn vị</th>
              <th>Trạng thái</th>
              <th width="160">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-muted"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr
                key={item.id}
                className="hover-row"
              >
                <td className="text-muted font-mono">
                  {item.product?.sku || "—"}
                </td>

                <td>
                  {item.branch?.name || "—"}
                </td>

                <td>
                  {item.product?.name}
                </td>

                <td>
                  {item.product?.category?.name}
                </td>

                <td className="font-bold">
                  {item.stock_quantity}
                </td>

                <td>
                  {item.unit || "-"}
                </td>

                <td>
                  {renderStatus(item)}
                </td>

                <td>
                  <div className="report-actions">
                    <button
                      className="btn-icon btn-add"
                      title="Thêm tồn kho"
                      onClick={() =>
                        navigate(
                          `/inventories/create?product_id=${item.product?.id}`
                        )
                      }
                    >
                      <FaPlus />
                    </button>

                    <button
                      className="btn-icon btn-view"
                      title="Xem chi tiết"
                      onClick={() =>
                        navigate(
                          `/inventories/${item.id}`
                        )
                      }
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn-icon btn-delete"
                      title="Xóa tồn kho"
                      onClick={() =>
                        handleDelete(item.id)
                      }
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
    </div>
  );
}

