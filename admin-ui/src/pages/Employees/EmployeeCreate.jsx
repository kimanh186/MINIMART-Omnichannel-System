import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminEmployee from "../../api/adminEmployee";
import { toast } from "react-toastify";
import axios from "axios";

function EmployeeCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [branches, setBranches] = useState([]);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    password: "",

    role: "staff",

    employment_type: "part_time",

    salary_per_hour: 30000,

    salary_per_month: "",

    participate_insurance: false,

    branch_id: "",

    gender: "",

    phone: "",

    birthday: "",

    start_date: "",

    address: "",

    status: "active",

    avatar: null,
  });
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const token =
        localStorage.getItem("admin_token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/branches",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBranches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (name === "avatar" && files?.[0]) {
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.username || !form.password) {
      return toast.warning("Vui lòng nhập đầy đủ Họ tên, Username, Mật khẩu");
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {

      if (k === "participate_insurance") {

        fd.append(
          k,
          v ? "1" : "0"
        );

        return;
      }

      if (v !== "" && v !== null) {
        fd.append(k, v);
      }

    });
    try {
      setLoading(true);

      await adminEmployee.create(fd);

      toast.success("Thêm nhân viên thành công ");

      setTimeout(() => {
        navigate("/admin/employees");
      }, 1200);

    } catch (err) {
      console.log("ERROR RESPONSE:");
      console.log(err.response?.data);

      toast.error(
        JSON.stringify(
          err.response?.data?.errors || {}
        )
      );
    }
  };


  return (
    <div className="order-page">
      <h2 className="admin-title">THÊM NHÂN VIÊN</h2>

      <button className="btn-link" onClick={() => navigate("/admin/employees")}>
        ← Quay lại danh sách
      </button>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Họ tên *</label>
          <input name="full_name" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Username *</label>
          <input name="username" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Mật khẩu *</label>
          <input type="password" name="password" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Chi nhánh</label>

          <select
            name="branch_id"
            value={form.branch_id}
            onChange={handleChange}
          >
            <option value="">
              -- Chọn chi nhánh --
            </option>

            {branches.map((branch) => (
              <option
                key={branch.id}
                value={branch.id}
              >
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Vai trò</label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="staff">
              Nhân viên
            </option>

            <option value="branch_manager">
              Quản lý chi nhánh
            </option>
          </select>
        </div>
        <div className="form-group">
          <label>Loại nhân viên</label>

          <select
            name="employment_type"
            value={form.employment_type}
            onChange={handleChange}
          >
            <option value="part_time">
              Part Time
            </option>

            <option value="full_time">
              Full Time
            </option>
          </select>
        </div>

        {form.employment_type ===
          "part_time" ? (

          <div className="form-group">
            <label>Lương / giờ</label>

            <input
              type="number"
              name="salary_per_hour"
              value={form.salary_per_hour}
              onChange={handleChange}
            />
          </div>

        ) : (

          <div className="form-group">
            <label>Lương / tháng</label>

            <input
              type="number"
              name="salary_per_month"
              value={form.salary_per_month}
              onChange={handleChange}
            />
          </div>

        )}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={
                form.participate_insurance
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  participate_insurance:
                    e.target.checked,
                })
              }
            />

            Tham gia BHXH
          </label>
        </div>

        <div className="form-group">
          <label>Giới tính</label>
          <select name="gender" onChange={handleChange}>
            <option value="">-- Chọn --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input name="phone" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Ngày sinh</label>
          <input type="date" name="birthday" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Ngày vào làm</label>
          <input type="date" name="start_date" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <textarea name="address" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Trạng thái</label>
          <select name="status" onChange={handleChange}>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm ngưng</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ảnh đại diện</label>
          <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
          {preview && <img src={preview} className="img-preview" />}
        </div>

        <div className="form-actions">
          <button className="btn-primary" disabled={loading}>
            {loading ? "Đang thêm..." : "Lưu nhân viên"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeCreate;
