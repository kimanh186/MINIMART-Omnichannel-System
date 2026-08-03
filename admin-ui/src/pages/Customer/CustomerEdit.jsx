import { useEffect, useState } from "react";
import { getCustomerById, updateCustomer } from "../api/adminCustomer";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";


export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
  });

  useEffect(() => {
    getCustomerById(id).then((res) => {
      if (res?.data?.user) {
        setForm({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          phone: res.data.user.phone || "",
          password: "",
          avatar: null,
        });
      }
    });
  }, [id]);



  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((k) => {
      if (k === "password" && !form[k]) return;
      if (form[k] !== null) fd.append(k, form[k]);
    });

    // toast loading ở giữa màn hình
    const toastId = toast.loading("Đang cập nhật thông tin khách hàng...");

    try {
      await updateCustomer(id, fd);

      toast.update(toastId, {
        render: "Cập nhật thông tin thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // cho user thấy toast rồi mới chuyển trang
      setTimeout(() => {
        navigate("/user");
      }, 1200);

    } catch (err) {
      console.error(err.response?.data);

      toast.update(toastId, {
        render: err.response?.data?.message || "Cập nhật thất bại ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };



  return (
    <div className="order-page">
      <h2 className="admin-title">CHỈNH SỬA THÔNG TIN KHÁCH HÀNG</h2>
      <Link to="/user" className="btn-back">
        ← Quay lại danh sách
      </Link>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên khách hàng *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập tên khách hàng"
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="form-group">
          <label>Avatar</label>
          <input type="file" name="avatar" onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
