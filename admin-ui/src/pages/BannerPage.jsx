import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import adminBanner from "../api/adminBanner";

import {
  FaTrash,
  FaEdit,
  FaPlus,
} from "react-icons/fa";

import { toast } from "react-toastify";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    image: null,
    sort_order: 0,
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await adminBanner.getAll();

      setBanners(res.data.data || []);
    } catch (err) {
      console.error(err);

      toast.error("Không thể tải banner");
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm({
      ...form,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({
      title: "",
      image: null,
      sort_order: 0,
      active: true,
    });

    setPreview(null);
    setEditing(null);
  };

  const handleEdit = (banner) => {
    setEditing(banner);

    setForm({
      title: banner.title || "",
      image: null,
      sort_order: banner.sort_order || 0,
      active: Boolean(banner.active),
    });

    setPreview(banner.image_url);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editing) return;

    const fd = new FormData();

    fd.append(
      "title",
      form.title || ""
    );

    fd.append(
      "sort_order",
      form.sort_order
    );

    fd.append(
      "active",
      form.active ? "1" : "0"
    );

    if (form.image) {
      fd.append(
        "image",
        form.image
      );
    }

    try {
      await adminBanner.update(
        editing.id,
        fd
      );

      toast.success(
        "Cập nhật banner thành công"
      );

      resetForm();

      fetchData();
    } catch (err) {
      console.error(
        err.response?.data
      );

      toast.error(
        err.response?.data?.message ||
        "Cập nhật banner thất bại"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa banner?"
    );

    if (!confirmDelete) return;

    try {
      await adminBanner.delete(id);

      toast.success(
        "Xóa banner thành công"
      );

      fetchData();
    } catch (err) {
      console.error(err);

      toast.error(
        "Xóa banner thất bại"
      );
    }
  };

  return (
    <div className="order-page">
      <div className="report-header">
        <h2 className="report-title">
          DANH SÁCH BANNER
        </h2>

        <button
          type="button"
          className="btn-primary"
          onClick={() =>
            navigate("/admin/banners/create")
          }
        >
          <FaPlus />
          Thêm banner
        </button>
      </div>

      {editing && (
        <form
          className="admin-form"
          onSubmit={handleUpdate}
        >
          <h3>
            CẬP NHẬT BANNER
          </h3>

          <div className="form-group">
            <label>Tiêu đề</label>

            <input
              value={form.title}
              placeholder="Nhập tiêu đề..."
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>
              Thứ tự hiển thị
            </label>

            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) =>
                setForm({
                  ...form,
                  sort_order:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Ảnh banner</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {preview && (
              <img
                src={preview}
                alt="Banner preview"
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({
                    ...form,
                    active:
                      e.target.checked,
                  })
                }
              />

              Hiển thị banner
            </label>
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              type="submit"
            >
              <FaEdit />
              Cập nhật banner
            </button>

            <button
              type="button"
              className="btn-link"
              onClick={resetForm}
            >
              Hủy sửa
            </button>
          </div>
        </form>
      )}

      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Thứ tự</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {banners.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="text-center text-muted"
              >
                Không có banner
              </td>
            </tr>
          )}

          {banners.map((banner) => (
            <tr key={banner.id}>
              <td>
                {banner.id}
              </td>

              <td>
                <img
                  src={banner.image_url}
                  alt={
                    banner.title ||
                    "Banner"
                  }
                  style={{
                    width: "180px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                />
              </td>

              <td>
                {banner.title || "—"}
              </td>

              <td>
                {banner.sort_order}
              </td>

              <td>
                {banner.active ? (
                  <span className="text-green">
                    Đang hiển thị
                  </span>
                ) : (
                  <span className="text-muted">
                    Đã ẩn
                  </span>
                )}
              </td>

              <td>
                <div className="report-actions">
                  <button
                    type="button"
                    className="btn-icon btn-edit"
                    title="Sửa"
                    onClick={() =>
                      handleEdit(banner)
                    }
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    className="btn-icon btn-delete"
                    title="Xóa"
                    onClick={() =>
                      handleDelete(
                        banner.id
                      )
                    }
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}