import { useEffect, useState } from "react";
import { printInventories } from "../api/adminInventory";
import { Link } from "react-router-dom";

function InventoryPrint() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    printInventories().then((res) => {
      setItems(res.data.data || res.data);
    });
  }, []);

  return (
    <div className="admin-page">
      <h2 className="admin-title">HÀNG SẮP HẾT / HẾT KHO</h2>

      <div className="admin-actions">
        <Link to="/inventories" className="btn-back">
          ← Quay lại danh sách
        </Link>

        <button className="btn-primary" onClick={() => window.print()}>
          🖨 In
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Sản phẩm</th>
            <th>Danh mục</th>
            <th>Tồn kho</th>
            <th>Đơn vị</th>
            <th>Hạn sử dụng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
          )}

          {items.map((i, index) => (
            <tr key={i.id}>
              <td>{index + 1}</td>
              <td>{i.product?.name}</td>
              <td>{i.product?.category?.name}</td>
              <td>{i.stock_quantity}</td>
              <td>{i.unit || "-"}</td>
              <td>
                {i.expired_date
                  ? new Date(i.expired_date).toLocaleDateString("vi-VN")
                  : "-"}
              </td>
              <td>
                {i.stock_quantity === 0
                  ? "HẾT HÀNG"
                  : i.stock_quantity <= 10
                    ? "SẮP HẾT"
                    : "CÒN HÀNG"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryPrint;
