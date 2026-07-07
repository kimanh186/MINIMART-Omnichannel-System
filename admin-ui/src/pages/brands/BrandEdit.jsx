import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";

export default function BrandEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [preview, setPreview] =
    useState(null);

  const [form, setForm] =
    useState({
      name: "",
      logo: null,
    });

  useEffect(() => {
    axiosClient
      .get(
        `/admin/brands/${id}`
      )
      .then((res) => {
        const brand = res.data.data;

        setForm({
          name: brand.name || "",
          logo: null,
        });

        if (brand.logo) {
          setPreview(
            `http://localhost:8000/storage/${brand.logo}`
          );
        }
      });
  }, [id]);

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

      fd.append(
        "_method",
        "PUT"
      );

      try {
        await axiosClient.post(
          `/admin/brands/${id}`,
          fd
        );

        toast.success(
          "Cập nhật thành công"
        );

        navigate("/admin/brands");
      } catch (err) {
        const message =
          err.response?.data?.errors?.name?.[0] ||
          err.response?.data?.message ||
          "Cập nhật thất bại";

        toast.error(message);
      }
    };

  return (
    <div className="order-page">
      <h2 className="admin-title">
        SỬA THƯƠNG HIỆU
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
          Cập nhật
        </button>
      </form>
    </div>
  );
}