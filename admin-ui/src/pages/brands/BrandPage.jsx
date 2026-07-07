import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("admin_user")
  );

  const fetchData = async () => {
    try {
      const res = await axiosClient.get(
        "/admin/brands",
        {
          params: {
            keyword,
            page,
          },
        }
      );

      setBrands(res.data.data || []);
      setLastPage(res.data.last_page || 1);

    } catch {
      toast.error("Không tải được thương hiệu");
    }
  };

  useEffect(() => {
    fetchData();
  }, [keyword, page]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa?"
      )
    ) {
      return;
    }

    try {
      await axiosClient.delete(
        `/admin/brands/${id}`
      );

      toast.success(
        "Xóa thành công"
      );

      fetchData();
    } catch {
      toast.error(
        "Xóa thất bại"
      );
    }
  };

  return (
    <div className="order-page">
      <h2 className="report-title">
        DANH SÁCH THƯƠNG HIỆU
      </h2>

      <div className="admin-toolbar">
        <div className="search-item">
          <label>Tên thương hiệu</label>

          <input
            placeholder="Nhập tên..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <button
          className="btn-primary"
          onClick={() =>
            navigate(
              "/admin/brands/create"
            )
          }
        >
          <FaPlus />
          Thêm thương hiệu
        </button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Logo</th>
            <th>Tên</th>
            {user?.role === "super_admin" && (
              <th>Hành động</th>
            )}
          </tr>
        </thead>

        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td>{brand.id}</td>

              <td>
                {brand.logo ? (
                  <img
                    src={`http://localhost:8000/storage/${brand.logo}`}
                    className="product-img"
                    alt=""
                  />
                ) : (
                  "-"
                )}
              </td>

              <td>
                {brand.name}
              </td>

              {user?.role === "super_admin" && (

                <td>
                  <div className="report-actions">

                    {user?.role === "super_admin" && (
                      <>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() =>
                            navigate(`/admin/brands/${brand.id}/edit`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-icon btn-delete"
                          onClick={() =>
                            handleDelete(brand.id)
                          }
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}

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