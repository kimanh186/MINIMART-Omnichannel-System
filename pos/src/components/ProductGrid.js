import { Plus } from "lucide-react";

export function ProductGrid({ products, onProductClick }) {
  return (
    <div className="product-grid">
      {products.map(product => {
        const isDisabled =
          !product.active ||
          product.stock === 0 ||
          product.is_expired;

        return (
          <div
            key={product.id}
            className={`product-card ${isDisabled ? "out-of-stock" : ""}`}
            onClick={() => !isDisabled && onProductClick(product)}
          >
            <div className="product-image-wrapper">
              <img
                src={
                  product.image
                    ? `http://localhost:8000/storage/${product.image}`
                    : "/placeholder.png"
                }
                alt={product.name}
              />

              {isDisabled && (
                <div className="sold-out-badge">
                  {product.is_expired
                    ? "HẾT HẠN"
                    : product.stock === 0
                    ? "HẾT HÀNG"
                    : "TẮT"}
                </div>
              )}
            </div>

            <h3 className="product-name">{product.name}</h3>

            <p
              className="product-price"
              style={{
                color: product.promotion > 0 ? "red" : "blue",
                fontWeight: "bold",
              }}
            >
              {(product.final_price ?? product.price).toLocaleString("vi-VN")}đ
            </p>

            <p className="product-category">{product.category?.name}</p>
          </div>
        );
      })}
    </div>
  );
}
