import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { getProductById } from '../services/productService';
import { getProducts } from '../services/productService'
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Shield,
  Truck,
} from 'lucide-react';

import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(id!)

        let rating = 0

        try {
          const ratingRes = await fetch(
            `http://localhost:8812/api/recommendations/${id}/average`
          )

          if (ratingRes.ok) {
            rating = await ratingRes.json()
          }
        } catch (err) {
          console.error('Không lấy được rating', err)
        }


        setProduct({
          id: data.id,
          name: data.name,
          price: Number(data.price),
          promotion: Number(data.promotion ?? 0),
          final_price:
            data.final_price !== null &&
            data.final_price !== undefined
              ? Number(data.final_price)
              : Number(data.price),

          image: `http://localhost:8000/storage/${data.image}`,

          description: data.description,
          category: data.category,
          rating: Number(rating.toFixed(1)),

          stock: data.stock,
          sold: data.sold || 0,

          expiry_date: data.expiry_date,
        })
        const res = await getProducts({});

const related = res.data
          .filter(
            (p: any) =>
              p.id !== data.id &&
              p.category?.name === data.category?.name
          )
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            promotion: Number(p.promotion ?? 0),
            final_price:
              p.final_price !== null &&
              p.final_price !== undefined
                ? Number(p.final_price)
                : Number(p.price),
            image: p.image,
            description: p.description,
            category: p.category,
            rating: 0,
            stock: p.stock,
          }))

        setRecommendedProducts(related)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy sản phẩm
        </h2>

        <button
          onClick={() => navigate('/')}
          className="text-blue-950 hover:text-blue-700"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-950 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="rounded-xl overflow-hidden bg-white-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[450px] object-contain p-6"
                />
              </div>
            </div>

            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full mb-4">
                {product.category?.name}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-700">
                Đã bán: <span className="font-medium text-blue-950">
                  {product.sold}
                </span> sản phẩm
              </p>

              <div className="flex items-center gap-3 mb-6">
                {/* <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium text-gray-700">
                  {product.rating}
                </span>
                <span className="text-gray-500">(128 đánh giá)</span> */}
              </div>


              <div className="mb-6">
                {(product.promotion ?? 0) !== 0 &&
                Number(product.final_price) < Number(product.price) ? (
                  <>
                    <p className="text-lg text-gray-400 line-through">
                      {formatPrice(Number(product.price))}
                    </p>
                    <p className="text-4xl font-bold text-red-600">
                      {formatPrice(Number(product.final_price))}
                    </p>
                    <p className="mt-1 text-sm font-medium text-red-600">
                      Giảm {Math.abs(Number(product.promotion)).toLocaleString("vi-VN")}đ
                    </p>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-blue-800">
                    {formatPrice(Number(product.price))}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  Tình trạng:{' '}
                  <span
                    className={`font-medium ${product.stock > 0 ? 'text-green-950' : 'text-red-950'
                      }`}
                  >
                    {product.stock > 0
                      ? `Còn ${product.stock} sản phẩm`
                      : 'Hết hàng'}
                  </span>
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Mô tả sản phẩm
                </h3>

                <p
                  className="text-gray-950 leading-relaxed overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.description}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng
                </label>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={product.stock}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(product.stock, Number(e.target.value))
                        )
                      )
                    }
                    className="w-20 h-10 text-center border border-gray-300 rounded-lg"
                  />

                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 rounded-lg border border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-950 text-blue-950 rounded-lg hover:bg-blue-50"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Thêm vào giỏ
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 px-6 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-800"
                >
                  Mua ngay
                </button>

                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart className="h-5 w-5 text-gray-950" />
                </button>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-800 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Bảo hành chính hãng
                    </p>
                    <p className="text-sm text-gray-600">
                      Đổi trả trong 7 ngày
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-blue-800 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Miễn phí vận chuyển
                    </p>
                    <p className="text-sm text-gray-600">
                      Giao hàng toàn quốc
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {recommendedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">
                Có thể bạn cũng thích
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
