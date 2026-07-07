import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import adminEmployee from "../../api/adminEmployee";
import { toast } from "react-toastify";
import axios from "axios";

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [branches, setBranches] = useState([]);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    password: "",
    role: "",
    branch_id: "",

    employment_type: "part_time",

    salary_per_hour: "",
    salary_per_month: "",

    participate_insurance: false,

    phone: "",
    gender: "",
    birthday: "",
    address: "",
    start_date: "",
    status: "",
    avatar: null,
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
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
  };

  useEffect(() => {
    adminEmployee.getById(id).then((res) => {
      const e = res.data.data;

      const formatDate = (d) => {
        if (!d) return "";
        if (typeof d === "object" && d.date) return d.date.split(" ")[0];
        if (typeof d === "string") return d.split(" ")[0];
        return "";
      };

      setForm({
        full_name: e.full_name || "",
        username: e.username || "",
        password: "",
        role: e.role || "",
        branch_id: e.branchC_id || "",

        employment_type:
          e.employment_type || "part_time",

        salary_per_hour: e.salary_per_hour || "",

        salary_per_month:
          e.salary_per_month || "",

        participate_insurance:
          !!e.participate_insurance,
        phone: e.phone || "",
        gender: e.gender || "",
        birthday: formatDate(e.birthday),
        start_date: formatDate(e.start_date),
        address: e.address || "",
        status: e.status || "",
        avatar: null,
      });

      if (e.avatar) {
        setPreview(`http://localhost:8000/storage/${e.avatar}`);
      }
    });
  }, [id]);


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

    const toastId = toast.loading("Đang cập nhật nhân viên...");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {

      if (k === "password" && !v)
        return;

      if (k === "participate_insurance") {
        fd.append(
          k,
          v ? "1" : "0"
        );
        return;
      }

      if (
        v !== null &&
        v !== ""
      ) {
        fd.append(k, v);
      }

    });

    try {
      await adminEmployee.update(id, fd);

      toast.update(toastId, {
        render: "Cập nhật nhân viên thành công ",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // đợi user thấy toast rồi mới chuyển trang
      setTimeout(() => {
        navigate("/admin/employees");
      }, 1500);

    } catch (err) {
      toast.update(toastId, {
        render: "Cập nhật thất bại ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  return (
    <div className="order-page">
      <h2 className="admin-title">CHỈNH SỬA NHÂN VIÊN</h2>
      <Link to="/admin/employees" className="btn-back">
        ← Quay lại danh sách
      </Link>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Họ và tên *</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Username *</label>
          <input name="username" value={form.username} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Mật khẩu (để trống nếu không đổi)</label>
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
          <label>Điện thoại</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Giới tính</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">-- Chọn --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ngày sinh</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <textarea name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Ngày bắt đầu</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Vai trò</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="staff">Nhân viên</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>

        </div>

        <div className="form-group">
          <label>Ảnh đại diện</label>
          <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
          {preview && <img src={preview} className="img-preview" />}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}
