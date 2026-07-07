import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BranchCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("admin_token");

      await axios.post(
        "http://127.0.0.1:8000/api/admin/branches",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/admin/branches");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="order-page">
      <div className="form-card">
        <h2 className="form-title">
          THÊM CHI NHÁNH
        </h2>

        <form onSubmit={submit} className="admin-form">
          <div className="form-group">
            <label>Tên chi nhánh</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Vĩ độ (Latitude)</label>
            <input
              value={form.latitude}
              onChange={(e) =>
                setForm({ ...form, latitude: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Kinh độ (Longitude)</label>
            <input
              value={form.longitude}
              onChange={(e) =>
                setForm({ ...form, longitude: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                navigate("/admin/branches")
              }
            >
              Hủy
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              Lưu chi nhánh
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}