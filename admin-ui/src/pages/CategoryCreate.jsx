import { useState } from "react";
import { createCategory } from "../api/adminCategory";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CategoryCreate() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Tên danh mục là bắt buộc");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    const toastId = toast.loading("Đang thêm danh mục...");

    try {
      setLoading(true);

      await createCategory(formData);

      toast.update(toastId, {
        render: "Thêm danh mục thành công ",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/categories");
      }, 1500);

    } catch (err) {
      const errors = err.response?.data?.errors;

      toast.update(toastId, {
        render:
          errors
            ? Object.values(errors)[0][0]
            : err.response?.data?.message || "Thêm danh mục thất bại",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="order-page">
      <h2 className="admin-title">THÊM DANH MỤC</h2>

      <button className="btn-link" onClick={() => navigate("/categories")}>
        ← Quay lại danh sách
      </button>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ảnh danh mục</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="img-preview"
            />
          )}
        </div>
        <div className="form-group">
          <label>
            Tên danh mục <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên danh mục"
          />
        </div>

        <div className="form-actions">
          <button className="btn-primary" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/categories")}
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryCreate;
