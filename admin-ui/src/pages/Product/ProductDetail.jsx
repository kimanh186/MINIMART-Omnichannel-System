import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    axiosClient
      .get(`/admin/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      });
  }, [id]);

  if (!product) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="order-page">
      <h2 className="admin-title">
        Chi tiết sản phẩm
      </h2>

      <Link
        to="/products"
        className="btn-back"
      >
        ← Quay lại
      </Link>

      <div className="detail-card">

        <div style={{ marginBottom: 20 }}>
          {product.image ? (
            <img
              src={`http://localhost:8000/storage/${product.image}`}
              alt={product.name}
              style={{
                width: 200,
                borderRadius: 10
              }}
            />
          ) : (
            <p>Không có ảnh</p>
          )}
        </div>

        <table className="report-table">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{product.id}</td>
            </tr>

            <tr>
              <th>SKU</th>
              <td>{product.sku}</td>
            </tr>

            <tr>
              <th>Tên sản phẩm</th>
              <td>{product.name}</td>
            </tr>

            <tr>
              <th>Danh mục</th>
              <td>
                {product.category?.name}
              </td>
            </tr>

            <tr>
              <th>Giá nhập</th>
              <td>
                {Number(
                  product.import_price
                ).toLocaleString()}
                đ
              </td>
            </tr>

            <tr>
              <th>Giá bán</th>
              <td>
                {Number(
                  product.price
                ).toLocaleString()}
                đ
              </td>
            </tr>

            <tr>
              <th>Khuyến mãi</th>
              <td>
                {Number(
                  product.promotion || 0
                ).toLocaleString()}
                đ
              </td>
            </tr>

            <tr>
              <th>Tồn kho</th>
              <td>
                {product.stock}
              </td>
            </tr>

            <tr>
              <th>Đơn vị</th>
              <td>
                {product.unit}
              </td>
            </tr>

            <tr>
              <th>Hạn sử dụng</th>
              <td>
                {product.expiry_date || "-"}
              </td>
            </tr>

            <tr>
              <th>Trạng thái</th>
              <td>
                {product.active
                  ? "Đang bán"
                  : "Ngừng bán"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}