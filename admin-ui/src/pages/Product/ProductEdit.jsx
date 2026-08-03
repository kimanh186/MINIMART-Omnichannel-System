import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { getProductById, updateProduct } from "../api/adminProduct";
import { toast } from "react-toastify";

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);

    const [form, setForm] = useState({
        name: "",
        sku: "",
        category_id: "",
        brand_id: "",
        import_price: 0,
        price: 0,
        promotion: 0,
        stock: 0,
        expiry_date: "",
        active: 0,
        image: null,
    });
    const [categories, setCategories] = useState([]);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getProductById(id);
                const data = res.data;

                setForm({
                    name: data.name || "",
                    sku: data.sku || "",
                    category_id: data.category_id || "",
                    brand_id: data.brand_id || "",
                    import_price: data.import_price || 0,
                    price: data.price || 0,
                    promotion: data.promotion || 0,
                    stock: data.stock || 0,
                    expiry_date: data.expiry_date || "",
                    active: data.active ? 1 : 0,
                    image: null,
                });

                setPreview(data.image ? `/storage/${data.image}` : null);

                const catRes = await axiosClient.get("/admin/categories");
                setCategories(catRes.data.data || []);
                const brandRes =
                    await axiosClient.get(
                        "/admin/brands"
                    );

                setBrands(
                    brandRes.data.data || []
                );
            } catch (err) {
                alert("Lấy sản phẩm thất bại");
                console.error(err);
            }
        }
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            setForm({ ...form, [name]: checked ? 1 : 0 });
        } else if (type === "file") {
            setForm({ ...form, [name]: files[0] });
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!form.name.trim()) {
            toast.warning("Vui lòng nhập tên sản phẩm");
            return;
        }
        if (!form.category_id) {
            toast.warning("Vui lòng chọn danh mục");
            return;
        }

        // toast loading
        const toastId = toast.loading("Đang cập nhật sản phẩm...");

        // chuẩn hóa dữ liệu trước khi gửi
        const submitData = { ...form };

        if (!submitData.hasOwnProperty("active")) submitData.active = 0;

        Object.keys(submitData).forEach(key => {
            if (submitData[key] === undefined || submitData[key] === null) {
                submitData[key] = "";
            }
        });

        try {
            await updateProduct(id, submitData);

            toast.update(toastId, {
                render: "Cập nhật sản phẩm thành công ",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate("/products");
            }, 1200);

        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                toast.update(toastId, {
                    render: "Dữ liệu không hợp lệ ",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            } else {
                toast.update(toastId, {
                    render: "Cập nhật sản phẩm thất bại ",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
            console.error(err);
        }
    };

    return (
        <div className="order-page">
            <h2 className="admin-title">CHỈNH SỬA SẢN PHẨM</h2>
            <Link to="/products" className="btn-back">
                ← Quay lại danh sách
            </Link>
            <form className="admin-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Tên sản phẩm *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} />
                    {errors.name && <p className="text-danger">{errors.name}</p>}
                </div>

                <div className="form-group">
                    <label>SKU</label>
                    <input type="text" name="sku" value={form.sku} onChange={handleChange} />
                    {errors.sku && <p className="text-danger">{errors.sku}</p>}
                </div>

                <div className="form-group">
                    <label>Danh mục *</label>
                    <select name="category_id" value={form.category_id} onChange={handleChange}>
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-danger">{errors.category_id}</p>}
                </div>

                <div className="form-group">
                    <label>Thương hiệu</label>

                    <select
                        name="brand_id"
                        value={form.brand_id}
                        onChange={handleChange}
                    >
                        <option value="">
                            -- Chọn thương hiệu --
                        </option>

                        {brands.map((brand) => (
                            <option
                                key={brand.id}
                                value={brand.id}
                            >
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Giá nhập *</label>
                    <input type="number" name="import_price" value={form.import_price} onChange={handleChange} min="0" />
                </div>

                <div className="form-group">
                    <label>Giá bán *</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} min="0" />
                </div>

                <div className="form-group">
                    <label>Khuyến mãi</label>
                    <input type="number" name="promotion" value={form.promotion} onChange={handleChange} min="0" />
                </div>

                <div className="form-group">
                    <label>Số lượng</label>
                    <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" />
                </div>

                <div className="form-group">
                    <label>Hạn sử dụng</label>
                    <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Hình ảnh</label>
                    {preview && <img src={preview} alt="Preview" className="img-preview" />}
                    <input type="file" name="image" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="active"
                            checked={form.active === 1}
                            onChange={handleChange}
                        /> Kích hoạt sản phẩm
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">Lưu thay đổi</button>
                </div>
            </form>
        </div>
    );
}
