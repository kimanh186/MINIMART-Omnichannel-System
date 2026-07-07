import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import storeInfoApi from "../api/storeInfoApi";

export default function StoreInfoPage() {
  const [form, setForm] = useState({
    store_name: "",
    description: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await storeInfoApi.get();

      if (res.data.data) {
        setForm({
          store_name:
            res.data.data.store_name || "",

          description:
            res.data.data.description || "",

          email:
            res.data.data.email || "",

          phone:
            res.data.data.phone || "",
        });
      }
    } catch (err) {
      console.error(err);

      toast.error(
        "Không thể tải thông tin cửa hàng"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await storeInfoApi.update(form);

      toast.success(
        "Cập nhật thông tin cửa hàng thành công"
      );

      loadData();
    } catch (err) {
      console.error(
        err.response?.data
      );

      toast.error(
        err.response?.data?.message ||
        "Cập nhật thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <h2 className="admin-title">
        THÔNG TIN CỬA HÀNG
      </h2>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Tên cửa hàng *</label>

          <input
            name="store_name"
            value={form.store_name}
            onChange={handleChange}
            placeholder="VD: MINIMART"
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="VD: kamart@gmail.com"
          />
        </div>

        <div className="form-group">
          <label>Hotline</label>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="VD: 0901 111 111"
          />
        </div>

        <div className="form-group">
          <label>
            Nội dung giới thiệu
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="7"
            placeholder="Nhập nội dung giới thiệu cửa hàng..."
          />
        </div>

        <div className="form-actions">
          <button
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Đang lưu..."
              : "Lưu thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
}