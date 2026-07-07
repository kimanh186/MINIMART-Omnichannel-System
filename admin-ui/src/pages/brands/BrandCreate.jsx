import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BrandCreate() {
  const navigate = useNavigate();

  const [preview, setPreview] =
    useState(null);

  const [form, setForm] =
    useState({
      name: "",
      logo: null,
    });

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    setForm({
      ...form,
      [name]: files
        ? files[0]
        : value,
    });

    if (
      name === "logo" &&
      files?.[0]
    ) {
      setPreview(
        URL.createObjectURL(
          files[0]
        )
      );
    }
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const fd =
        new FormData();

      fd.append(
        "name",
        form.name
      );

      if (form.logo) {
        fd.append(
          "logo",
          form.logo
        );
      }

      try {
        await axiosClient.post(
          "/admin/brands",
          fd
        );

        toast.success(
          "Thêm thành công"
        );

        navigate("/admin/brands");
      } catch (err) {
        const message =
          err.response?.data?.errors?.name?.[0] ||
          err.response?.data?.message ||
          "Thêm thất bại";

        toast.error(message);
      }
    };

  return (
    <div className="order-page">
      <h2 className="admin-title">
        THÊM THƯƠNG HIỆU
      </h2>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>
            Tên thương hiệu
          </label>

          <input
            name="name"
            value={form.name}
            onChange={
              handleChange
            }
          />
        </div>

        <div className="form-group">
          <label>Logo</label>

          <input
            type="file"
            name="logo"
            onChange={
              handleChange
            }
          />

          {preview && (
            <img
              src={preview}
              className="img-preview"
              alt=""
            />
          )}
        </div>

        <button className="btn-primary">
          Lưu
        </button>
      </form>
    </div>
  );
}