import { createProduct } from "../api/adminProduct";
import { getCategories } from "../api/adminCategory";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function ProductCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sku: "",
    name: "",
    category_id: "",
    brand_id: "",
    brand_name: "",
    import_price: "",
    price: "",
    promotion: "",
    stock: "",
    unit: "pcs",
    expiry_date: "",
    image: null,
    active: false,
  });

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getCategories()
      .then(res => {
        setCategories(res.data.data || res.data);
      })
      .catch(err => {
        console.error("Lỗi load categories", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api/brands"
      )
      .then((res) => {
        setBrands(
          res.data.data ||
          res.data ||
          []
        );
      })
      .catch((err) => {
        console.error(
          "Lỗi load brands",
          err
        );
      });
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const toastId = toast.loading(
      "Đang thêm sản phẩm..."
    );

    try {
      const {
        brand_name,
        ...productData
      } = form;

      await createProduct({
        ...productData,

        brand_id:
          productData.brand_id || null,

        active:
          productData.active ? 1 : 0,

        stock:
          productData.stock || 0,

        promotion:
          productData.promotion || 0,
      });

      toast.update(toastId, {
        render:
          "Thêm sản phẩm thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(
          err.response.data.errors || {}
        );

        toast.update(toastId, {
          render: "Dữ liệu không hợp lệ",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: "Thêm sản phẩm thất bại",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        console.error(err);
      }
    }
  };


  return (
    <div className="order-page">
      <h2 className="admin-title">Thêm sản phẩm mới</h2>
      <Link to="/products" className="btn-back">
        ← Quay lại danh sách
      </Link>
      <form className="admin-form" onSubmit={handleSubmit} noValidate>

        <div className="form-group">
          <label>Mã sản phẩm</label>
          <input type="text" name="sku" value={form.sku} onChange={handleChange} />
          {errors.sku && <p className="text-danger">{errors.sku}</p>}
        </div>

        <div className="form-group">
          <label>Tên sản phẩm *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
          {errors.name && <p className="text-danger">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Danh mục *</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Chọn danh mục --
            </option>

            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>


          {errors.category_id && <p className="text-danger">{errors.category_id}</p>}
        </div>
        <div className="form-group">
          <label>Thương hiệu</label>

          <input
            type="text"
            list="brand-list"
            value={form.brand_name}
            placeholder="Nhập hoặc chọn thương hiệu..."
            onChange={(e) => {
              const value = e.target.value;

              const selectedBrand = brands.find(
                (brand) => brand.name === value
              );

              setForm({
                ...form,
                brand_name: value,
                brand_id: selectedBrand
                  ? selectedBrand.id
                  : "",
              });
            }}
          />

          <datalist id="brand-list">
            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.name}
              />
            ))}
          </datalist>

          {errors.brand_id && (
            <p className="text-danger">
              {errors.brand_id}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Giá nhập *</label>
          <input type="number" name="import_price" value={form.import_price} onChange={handleChange} min="0" required />
          {errors.import_price && <p className="text-danger">{errors.import_price}</p>}
        </div>

        <div className="form-group">
          <label>Giá *</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} min="0" required />
          {errors.price && <p className="text-danger">{errors.price}</p>}
        </div>

        <div className="form-group">
          <label>Khuyến mãi</label>
          <input type="number" name="promotion" value={form.promotion} onChange={handleChange} min="0" />
          {errors.promotion && <p className="text-danger">{errors.promotion}</p>}
        </div>

        <div className="form-group">
          <label>Số lượng</label>
          <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" />
          {errors.stock && <p className="text-danger">{errors.stock}</p>}
        </div>

        <div className="form-group">
          <label>Đơn vị *</label>
          <input type="text" name="unit" value={form.unit} onChange={handleChange} required />
          {errors.unit && <p className="text-danger">{errors.unit}</p>}
        </div>

        <div className="form-group">
          <label>Hạn sử dụng</label>
          <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange} />
          {errors.expiry_date && <p className="text-danger">{errors.expiry_date}</p>}
        </div>

        <div className="form-group">
          <label>Hình ảnh</label>
          <input type="file" name="image" onChange={handleChange} />
          {preview && <img src={preview} alt="Preview" className="img-preview" />}
          {errors.image && <p className="text-danger">{errors.image}</p>}
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> Kích hoạt sản phẩm
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Thêm sản phẩm</button>
        </div>
      </form>
    </div>
  );
}
