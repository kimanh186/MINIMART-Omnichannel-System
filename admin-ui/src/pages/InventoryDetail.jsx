import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getInventory } from "../api/adminInventory";

function InventoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getInventory(id);
        setItem(res.data); 
      } catch (err) {
        console.error(err);
        alert("Lỗi tải chi tiết tồn kho");
      }
    };

    fetchDetail();
  }, [id]);

  if (!item) return <p>Đang tải...</p>;

  return (
    <div className="order-page">
      <h2 className="admin-title"> CHI TIẾT TỒN KHO</h2>
      <Link to="/inventories" className="btn-back">
        ← Quay lại danh sách
      </Link>

      <ul className="detail-list">
        <li>
          <b>Chi nhánh:</b> {item.branch?.name}
        </li>
        <li><b>Sản phẩm:</b> {item.product?.name}</li>
        <li><b>Danh mục:</b> {item.product?.category?.name}</li>
        <li><b>Tồn kho:</b> {item.stock_quantity}</li>
        <li><b>Đơn vị:</b> {item.unit}</li>
        <li><b>Hạn dùng:</b> {item.expired_date}</li>
      </ul>
    </div>
  );
}

export default InventoryDetail;
