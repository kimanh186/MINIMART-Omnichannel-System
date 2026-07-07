import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategoryById, updateCategory } from "../api/adminCategory";
import { toast } from "react-toastify";

export default function CategoryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();


    const [form, setForm] = useState({
        name: "",
        image: null,
    });

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getCategoryById(id);
                const data = res.data.data;
                setForm({
                    name: data.name || "",
                    image: null,
                });

                if (data.image) {
                    setPreview(
                        `http://localhost:8000/storage/${data.image}`
                    );
                }
            } catch (err) {
                alert("Không tìm thấy danh mục");
                navigate("/categories");
            }
        }

        fetchData();
    }, [id]);


    const handleChange = (e) => {
        const {
            name,
            value,
            files,
            type
        } = e.target;

        if (type === "file") {

            const file = files[0];

            setForm({
                ...form,
                image: file
            });

            if (file) {
                setPreview(
                    URL.createObjectURL(file)
                );
            }

        } else {

            setForm({
                ...form,
                [name]: value
            });

        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setErrors({ name: "Tên danh mục không được để trống" });
            toast.warning("Vui lòng nhập tên danh mục");
            return;
        }

        const toastId = toast.loading("Đang cập nhật danh mục...");

        try {
            const fd = new FormData();

            fd.append("name", form.name);

            if (form.image) {
                fd.append("image", form.image);
            }

            await updateCategory(id, fd);
            toast.update(toastId, {
                render: "Cập nhật danh mục thành công",
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
                        : err.response?.data?.message || "Cập nhật danh mục thất bại",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });

            setErrors(errors || {});
        }
    };



    return (
        <div className="order-page">
            <h2 className="admin-title">Chỉnh sửa danh mục</h2>
            <Link to="/categories" className="btn-back">
                ← Quay lại danh sách
            </Link>
            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Ảnh danh mục</label>

                    {preview && (
                        <img
                            src={preview}
                            alt=""
                            className="img-preview"
                        />
                    )}

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Tên danh mục *</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nhập tên danh mục..."
                    />
                    {errors.name && (
                        <p className="text-danger">{errors.name}</p>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={false}>
                        Lưu thay đổi
                    </button>


                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/categories")}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
