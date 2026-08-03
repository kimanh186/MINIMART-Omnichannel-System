import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  createInventory,
  getInventoryByProduct
} from "../api/adminInventory";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

function InventoryCreate() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [params] = useSearchParams();
  const selectedProductId = params.get("product_id");
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentStock, setCurrentStock] = useState(0);

  const [form, setForm] = useState({
    branch_id: "",
    product_id: selectedProductId || "",
    add_quantity: "",
    import_price: "",
    sale_price: "",
    expired_date: "",
    unit: "",
  });
  useEffect(() => {

    if (
      !form.product_id ||
      !form.branch_id
    ) {
      setCurrentStock(0);
      return;
    }

    getInventoryByProduct(
      form.product_id,
      form.branch_id
    ).then((res) => {
      setCurrentStock(
        res.data.stock_quantity || 0
      );
    });

  }, [
    form.product_id,
    form.branch_id
  ]);


  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("admin_user")
    );

    setUser(currentUser);

    axiosClient.get("/admin/products").then((res) => {
      setProducts(res.data.data || []);
    });

    axiosClient.get("/admin/branches").then((res) => {
      if (currentUser?.role === "branch_manager") {

        const currentBranch = res.data.find(
          b => b.id === currentUser.branch_id
        );

        setBranches(
          currentBranch ? [currentBranch] : []
        );

        setForm(prev => ({
          ...prev,
          branch_id: String(currentUser.branch_id),
        }));

      } else {

        setBranches(res.data);

      }
    });
  }, []);

  const handleProductChange = async (e) => {
    const productId = e.target.value;

    setForm({ ...form, product_id: productId });

    if (!productId) {
      setCurrentStock(0);
      return;
    }

    const res =
      await getInventoryByProduct(
        productId,
        form.branch_id
      );
    setCurrentStock(res.data.stock_quantity || 0);
  };
  const handleBranchChange = async (e) => {

    const branchId = e.target.value;

    setForm({
      ...form,
      branch_id: branchId,
    });

    if (
      !branchId ||
      !form.product_id
    ) {
      setCurrentStock(0);
      return;
    }

    const res =
      await getInventoryByProduct(
        form.product_id,
        branchId
      );

    setCurrentStock(
      res.data.stock_quantity || 0
    );
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.product_id || !form.add_quantity) {
      toast.warning("Vui lòng chọn sản phẩm và nhập số lượng");
      return;
    }

    const toastId = toast.loading("Đang lưu tồn kho...");

    try {
      await createInventory(form);

      toast.update(toastId, {
        render: "Thêm tồn kho thành công ",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/inventories");
      }, 1500);

    } catch (err) {
      toast.update(toastId, {
        render:
          err.response?.data?.message ||
          "Thêm tồn kho thất bại ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  return (
    <div className="order-page">
      <h2 className="admin-title">➕ THÊM TỒN KHO</h2>
      <Link to="/inventories" className="btn-back">
        ← Quay lại danh sách
      </Link>

      <form className="admin-form" onSubmit={submit}>
        <select
          name="branch_id"
          value={form.branch_id}
          onChange={handleBranchChange}
          required
        >
          {user?.role === "super_admin" && (
            <option value="">
              -- Chọn chi nhánh --
            </option>
          )}

          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleProductChange}
          required
        >
          <option value="">-- Chọn sản phẩm --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="form-group">
          <label>Tồn kho hiện tại</label>
          <input
            type="number"
            value={currentStock}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="form-group">
          <label>Số lượng nhập thêm</label>
          <input
            name="add_quantity"
            type="number"
            min="0"
            value={form.add_quantity}
            onChange={handleChange}
            required
          />
        </div>

        <input name="expired_date" type="date" onChange={handleChange} />

        <button className="btn-primary">Lưu tồn kho</button>
      </form>
    </div>
  );
}

export default InventoryCreate;
