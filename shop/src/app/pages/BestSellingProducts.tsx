import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { ProductCard } from '../components/ProductCard'
import axios from 'axios'
import { ProductFilter } from './ProductFilter'

export function BestSellingProducts() {
  const [products, setProducts] =
    useState<any[]>([])

  const [loading, setLoading] =
    useState(true)

  const [minPrice, setMinPrice] =
    useState('')

  const [maxPrice, setMaxPrice] =
    useState('')

  const [brand, setBrand] =
    useState('')

  const [brands, setBrands] =
    useState<any[]>([])

  const [sort, setSort] =
    useState('')

  const [selectedBranch] =
    useState(
      localStorage.getItem(
        'branch_id'
      ) || ''
    )

  // =========================
  // LOAD BEST SELLING
  // =========================

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)

        const res = await axios.get(
          'http://127.0.0.1:8000/api/products/best-selling',
          {
            params: {
              branch_id:
                selectedBranch || undefined,
            },
          }
        )

        const mapped = (
          res.data.data || []
        ).map((p: any) => ({
          id: p.id,

          name: p.name,

          price: Number(p.price),

          promotion: Number(
            p.promotion ?? 0
          ),

          final_price:
            p.final_price !== null &&
            p.final_price !== undefined
              ? Number(p.final_price)
              : Number(p.price),

          image: p.image,

          description:
            p.description,

          category: p.category,

          brand: p.brand,

          rating: 0,

          stock: Number(
            p.stock ?? 0
          ),
        }))

        setProducts(mapped)

      } catch (error) {
        console.error(
          'Lỗi sản phẩm bán chạy:',
          error
        )

      } finally {
        setLoading(false)
      }
    }

    loadProducts()

  }, [selectedBranch])

  // =========================
  // LOAD BRANDS
  // =========================

  useEffect(() => {
    axios
      .get(
        'http://127.0.0.1:8000/api/brands'
      )
      .then((res) => {
        setBrands(
          res.data.data ||
          res.data ||
          []
        )
      })
      .catch(console.error)

  }, [])

  // =========================
  // FILTER
  // =========================

  const filteredProducts =
    useMemo(() => {
      let result = [...products]

      if (minPrice) {
        result = result.filter(
          (product) =>
            product.final_price >=
            Number(minPrice)
        )
      }

      if (maxPrice) {
        result = result.filter(
          (product) =>
            product.final_price <=
            Number(maxPrice)
        )
      }

      if (brand) {
        result = result.filter(
          (product) =>
            product.brand?.name ===
            brand
        )
      }

      if (sort === 'price-asc') {
        result.sort(
          (a, b) =>
            a.final_price -
            b.final_price
        )
      }

      if (sort === 'price-desc') {
        result.sort(
          (a, b) =>
            b.final_price -
            a.final_price
        )
      }

      return result

    }, [
      products,
      minPrice,
      maxPrice,
      brand,
      sort,
    ])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        Đang tải sản phẩm...
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-6">
        🔥 Sản phẩm bán chạy
      </h1>

      <ProductFilter
        minPrice={minPrice}
        setMinPrice={setMinPrice}

        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}

        brand={brand}
        setBrand={setBrand}

        brands={brands}

        sort={sort}
        setSort={setSort}

        onReset={() => {
          setMinPrice('')
          setMaxPrice('')
          setBrand('')
          setSort('')
        }}
      />

      <p className="text-gray-500 mb-8">
        Những sản phẩm được khách hàng mua nhiều nhất
      </p>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Chi nhánh hiện tại chưa có sản phẩm bán chạy phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}

        </div>
      )}

    </div>
  )
}