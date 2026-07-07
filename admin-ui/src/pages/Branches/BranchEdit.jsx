import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

export default function BranchEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    active: true,
  });

  const loadData = async () => {
    try {
      const token =
        localStorage.getItem("admin_token");

      const res = await axios.get(
        `http://127.0.0.1:8000/api/admin/branches/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("admin_token");

      await axios.put(
        `http://127.0.0.1:8000/api/admin/branches/${id}`,
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

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="order-page">
      <div className="form-card">
        <h2 className="form-title">
          CẬP NHẬT CHI NHÁNH
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

          <div className="form-group">
            <label>Trạng thái</label>

            <select
              value={form.active ? "1" : "0"}
              onChange={(e) =>
                setForm({
                  ...form,
                  active: e.target.value === "1",
                })
              }
            >
              <option value="1">
                Hoạt động
              </option>
              <option value="0">
                Đã khóa
              </option>
            </select>
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
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}