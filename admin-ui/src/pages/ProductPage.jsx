import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { getProducts, deleteProduct } from "../api/adminProduct";
import { FaEye, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductPage() {
  const user = JSON.parse(
    localStorage.getItem("admin_user")
  );
  const [brands, setBrands] =
    useState([]);

  const [brandId, setBrandId] =
    useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expiryBefore, setExpiryBefore] = useState("");

  useEffect(() => {
    axiosClient
      .get("/admin/categories")
      .then((res) => {
        setCategories(res.data.data || []);
      });
  }, []);

  const fetchData = async () => {
    const res = await getProducts({
      keyword,
      expiry_before: expiryBefore,
      category_id: categoryId,
      page,
    });

    setProducts(res.data.data || []);
    setLastPage(res.data.last_page || 1);

    setTotal(
      res.data.total ||
      res.data.meta?.total ||
      0
    );
  };
  useEffect(() => {
    fetchData();
  }, [keyword, expiryBefore, categoryId, page]);


  const handleDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p>Bạn có chắc muốn xóa sản phẩm này?</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              className="btn-primary"
              onClick={async () => {
                closeToast();

                const toastId = toast.loading("Đang xóa sản phẩm...");

                try {
                  await deleteProduct(id);

                  toast.update(toastId, {
                    render: "Đã xóa sản phẩm thành công",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                  });

                  fetchData();
                } catch (err) {
                  toast.update(toastId, {
                    render: "Xóa sản phẩm thất bại ",
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
  const isFiltering =
    keyword ||
    categoryId ||
    expiryBefore;

  return (
    <div className="report-page">
      <h2 className="report-title">DANH SÁCH SẢN PHẨM</h2>

      {/* TOOLBAR */}
      <div className="admin-toolbar">
        <form className="search-box search-grid">
          <div className="search-item">
            <label>Tên / Mã sản phẩm</label>
            <input
              placeholder="Nhập tên hoặc SKU..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="search-item">
  <label>Danh mục</label>

  <select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
  >
    <option value="">Tất cả danh mục</option>

    {categories.map((c) => (
      <option key={c.id} value={c.id}>
        {c.name}
      </option>
    ))}
  </select>
</div>

<div className="search-item">
  <label>Thương hiệu</label>

  <select
    value={brandId}
    onChange={(e) => setBrandId(e.target.value)}
  >
    <option value="">Tất cả thương hiệu</option>

    {brands.map((b) => (
      <option key={b.id} value={b.id}>
        {b.name}
      </option>
    ))}
  </select>
</div>

          <div className="search-item">
            <label>Hạn sử dụng trước</label>
            <input
              type="date"
              value={expiryBefore}
              onChange={(e) => setExpiryBefore(e.target.value)}
            />
          </div>

          <div className="search-item search-btn">
            <label>&nbsp;</label>
            {user?.role === "super_admin" && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate("/products/create")}
              >
                <FaPlus /> Thêm sản phẩm
              </button>
            )}
          </div>
        </form>
      </div>
      {isFiltering ? (
        <div className="result-count">
          Tìm thấy {products.length} sản phẩm
        </div>
      ) : (
        <div className="result-count">
          Tổng cộng {total || products.length} sản phẩm
        </div>
      )}

      {/* TABLE */}
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>SKU</th>
            <th>Tên</th>
            <th>Thương hiệu</th>
            <th>Danh mục</th>
            <th>Giá nhập</th>
            <th>Giá bán</th>
            <th>Khuyến mãi</th>
            <th>Hạn sử dụng</th>
            <th>Hành động</th>
          </tr>
        </thead>


        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
          )}

          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.image ? (
                  <img
                    src={`http://localhost:8000/storage/${p.image}`}
                    alt={p.name}
                    className="product-img"
                  />
                ) : (
                  <div className="img-empty">—</div>
                )}
              </td>

              <td>{p.sku}</td>
              <td className="product-name">{p.name}</td>
              <td>
                {p.brand?.name || "-"}
              </td>
              <td>{p.category?.name || "-"}</td>
              {/* Giá nhập */}
              <td>
                {p.import_price
                  ? p.import_price.toLocaleString()
                  : 0}
              </td>

              {/* Giá bán */}
              <td className="price-sale">
                {p.price ? p.price.toLocaleString() : 0}
              </td>

              <td className="price-promo">
                {p.promotion > 0 ? (
                  <span className="promo-badge">
                    -{p.promotion.toLocaleString()} ₫
                  </span>
                ) : (
                  "-"
                )}
              </td>

              {/* Hạn sử dụng */}
              <td className="product-name">
                {p.expiry_date
                  ? new Date(p.expiry_date).toLocaleDateString("vi-VN")
                  : "-"}
              </td>

              <td>
                <td>
                  <div className="report-actions">

                    <button
                      className="btn-icon btn-view"
                      onClick={() => navigate(`/products/${p.id}`)}
                    >
                      <FaEye />
                    </button>

                    {user?.role === "super_admin" && (
                      <>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => navigate(`/products/${p.id}/edit`)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(p.id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}

                  </div>
                </td>
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
