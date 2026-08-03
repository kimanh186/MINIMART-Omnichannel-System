import { useState } from "react";
import { useNavigate } from "react-router-dom";

import adminBanner from "../api/adminBanner";

import {
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";

import { toast } from "react-toastify";

export default function BannerCreate() {
  const navigate = useNavigate();

  const [preview, setPreview] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    image: null,
    sort_order: 0,
    active: true,
  });

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm({
      ...form,
      image: file,
    });

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      return toast.warning(
        "Vui lòng chọn ảnh banner"
      );
    }

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

    fd.append(
      "image",
      form.image
    );

    try {
      setLoading(true);

      await adminBanner.create(fd);

      toast.success(
        "Thêm banner thành công"
      );

      navigate("/admin/banners");
    } catch (err) {
      console.error(
        err.response?.data
      );

      toast.error(
        err.response?.data?.message ||
        "Thêm banner thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <h2 className="report-title">
        THÊM BANNER
      </h2>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
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
                maxHeight: "300px",
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
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            <FaPlus />

            {loading
              ? " Đang thêm..."
              : " Thêm banner"}
          </button>

          <button
            type="button"
            className="btn-link"
            onClick={() =>
              navigate("/admin/banners")
            }
          >
            <FaArrowLeft />
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}