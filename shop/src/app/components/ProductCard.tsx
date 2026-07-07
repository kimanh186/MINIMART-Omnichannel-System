import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "../context/CartContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const promotion = Number(product.promotion ?? 0);

  const finalPrice =
    product.final_price !== undefined &&
    product.final_price !== null
      ? Number(product.final_price)
      : Number(product.price) + promotion;

  const hasPromotion =
    promotion !== 0 &&
    finalPrice < Number(product.price);

  const handleAddToCart = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    addToCart({
      ...product,
      final_price: finalPrice,
    });

    toast.success(
      `Đã thêm ${product.name} vào giỏ hàng!`
    );
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative overflow-hidden bg-white">
        <img
          src={`http://localhost:8000/storage/${product.image}`}
          alt={product.name}
          className="w-full h-64 object-contain p-6 group-hover:scale-105 transition-transform duration-300"
        />

        {hasPromotion && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            Giảm{" "}
            {Math.abs(promotion).toLocaleString(
              "vi-VN"
            )}
            đ
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs text-blue-800 font-medium mb-1">
          {product.category?.name}
        </div>

        <h3 className="font-semibold text-blue-950 mb-2 line-clamp-2 group-hover:text-blue-800 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-end justify-between">
          <div>
            {hasPromotion ? (
              <>
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(
                    Number(product.price)
                  )}
                </p>

                <p className="text-xl font-bold text-red-600">
                  {formatPrice(finalPrice)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-blue-800">
                {formatPrice(
                  Number(product.price)
                )}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />

            <span className="hidden sm:inline text-sm">
              Thêm
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}