import { useEffect, useState } from 'react';
import { ChevronRight, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ProductCard } from '../components/ProductCard';
import Banner from '../components/Banner';
import { Products } from './Products';

export function Home() {
  const navigate = useNavigate();

  const [bestSelling, setBestSelling] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    loadBestSelling();
    loadPromotions();
  }, []);

  const mapProducts = (products: any[]) => {
    return products.map((p: any) => ({
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
    }));
  };

  const loadBestSelling = async () => {
  try {
    const branchId =
      localStorage.getItem(
        "branch_id"
      );

    const res = await axios.get(
      'http://127.0.0.1:8000/api/products/best-selling',
      {
        params: {
          branch_id:
            branchId || undefined,
        },
      }
    );

    const products = mapProducts(
      res.data.data || []
    );

    setBestSelling(
      products.slice(0, 4)
    );

  } catch (error) {
    console.log(
      'Lỗi sản phẩm bán chạy:',
      error
    );
  }
};

  const loadPromotions = async () => {
  try {
    const branchId =
      localStorage.getItem(
        "branch_id"
      );

    const res = await axios.get(
      'http://127.0.0.1:8000/api/products/promotions',
      {
        params: {
          branch_id:
            branchId || undefined,
        },
      }
    );

    const products = mapProducts(
      res.data.data || []
    );

    setPromotions(
      products.slice(0, 4)
    );

  } catch (error) {
    console.log(
      'Lỗi sản phẩm khuyến mãi:',
      error
    );
  }
};

  return (
    <div>
      {/* Hero Section */}

      <Banner />

      {/* Features */}

      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-950" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Miễn phí vận chuyển
                </h3>

                <p className="text-sm text-gray-950">
                  ________________________
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-950" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Uy tín • Tiện lợi
                </h3>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-950" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Hỗ trợ 24/7
                </h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BEST SELLING */}

      <section className="py-12">
        <div className="container mx-auto px-4">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-red-500" />

              <h2 className="text-3xl font-bold">
                Sản phẩm bán chạy
              </h2>
            </div>

            <button
              onClick={() =>
                navigate('/best-selling')
              }
              className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800"
            >
              Xem tất cả

              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {bestSelling.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Chưa có sản phẩm bán chạy.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {bestSelling.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          )}

        </div>
      </section>

      {/* PROMOTIONS */}

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-3">
              <Zap className="w-7 h-7 text-yellow-500" />

              <h2 className="text-3xl font-bold">
                Sản phẩm khuyến mãi
              </h2>
            </div>

            <button
              onClick={() =>
                navigate('/promotions')
              }
              className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800"
            >
              Xem tất cả

              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {promotions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Hiện chưa có sản phẩm khuyến mãi.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {promotions.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          )}

        </div>
      </section>
 {/* Products */}
      <section id="products">
        <Products />
      </section>
    </div>
  );
}