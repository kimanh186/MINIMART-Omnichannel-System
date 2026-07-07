import {
  useEffect,
  useState,
} from 'react'

import {
  useSearchParams,
} from 'react-router-dom'

import { ProductCard } from '../components/ProductCard'
import { getProducts } from '../services/productService'
import { getBranches } from '../services/branchService'

import axios from 'axios'

import ChatBot from '../components/ChatBot'
import { ProductFilter } from './ProductFilter'
import { useCart } from '../context/CartContext'

export function Products() {
  const { checkCartByBranch } = useCart()

  const [searchParams] =
    useSearchParams()

  const keyword =
    searchParams.get('search') || ''

  const [minPrice, setMinPrice] =
    useState('')

  const [maxPrice, setMaxPrice] =
    useState('')

  const [category, setCategory] =
    useState('')

  const [categories, setCategories] =
    useState<any[]>([])

  const [brand, setBrand] =
    useState('')

  const [brands, setBrands] =
    useState<any[]>([])

  const [sort, setSort] =
    useState('')

  const [open, setOpen] =
    useState(false)

  const [products, setProducts] =
    useState<any[]>([])

  const [branches, setBranches] =
    useState<any[]>([])

  const [loading, setLoading] =
    useState(true)

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState(
    localStorage.getItem(
      'branch_id'
    ) || ''
  )


  useEffect(() => {
    async function loadInitialData() {
      try {
        const [
          categoriesRes,
          brandsRes,
          branchesRes,
        ] = await Promise.all([
          axios.get(
            'http://127.0.0.1:8000/api/categories'
          ),

          axios.get(
            'http://127.0.0.1:8000/api/brands'
          ),

          getBranches(),
        ])

        setCategories(
          categoriesRes.data.data || []
        )

        setBrands(
          brandsRes.data.data ||
          brandsRes.data ||
          []
        )

        setBranches(
          branchesRes || []
        )
      } catch (error) {
        console.error(
          'Lỗi load dữ liệu:',
          error
        )
      }
    }

    loadInitialData()
  }, [])

  // TỰ ĐỘNG TÌM CHI NHÁNH GẦN NHẤT
  // CHỈ CHẠY KHI CHƯA CÓ CHI NHÁNH
  useEffect(() => {
    const savedBranchId =
      localStorage.getItem(
        'branch_id'
      )

    if (savedBranchId) {
      return
    }

    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat =
            position.coords.latitude

          const lng =
            position.coords.longitude

          const res = await axios.get(
            'http://127.0.0.1:8000/api/branches/nearest',
            {
              params: {
                latitude: lat,
                longitude: lng,
              },
            }
          )

          if (!res.data) {
            return
          }

          const branchId =
            String(res.data.id)

          setSelectedBranch(
            branchId
          )

          localStorage.setItem(
            'branch_id',
            branchId
          )

          localStorage.setItem(
            'branch_name',
            res.data.name
          )
        } catch (error) {
          console.error(
            'Lỗi tìm chi nhánh:',
            error
          )
        }
      },

      (error) => {
        console.log(
          'Không lấy được vị trí:',
          error
        )
      },

      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000,
      }
    )
  }, [])

  // LOAD SẢN PHẨM
  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setLoading(true)

      try {
        const res =
          await getProducts({
            branch_id:
              selectedBranch,

            keyword,

            category,

            brand,

            min_price:
              minPrice,

            max_price:
              maxPrice,

            sort,
          })

        if (cancelled) {
          return
        }

        const mapped =
          (res.data || []).map(
            (p: any) => ({
              id: p.id,

              name: p.name,

              price: Number(
                p.price
              ),

              promotion: Number(
                p.promotion ?? 0
              ),

              final_price:
                p.final_price !== null &&
                  p.final_price !== undefined
                  ? Number(
                    p.final_price
                  )
                  : Number(
                    p.price
                  ),

              image: p.image,

              description:
                p.description,

              category:
                p.category,

              brand:
                p.brand,

              rating: 0,

              stock: Number(
                p.stock ?? 0
              ),
            })
          )

        setProducts(mapped)
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Lỗi load sản phẩm:',
            error
          )

          setProducts([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    const timer = setTimeout(
      loadProducts,
      300
    )

    return () => {
      cancelled = true

      clearTimeout(timer)
    }
  }, [
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
    selectedBranch,
  ])

  const handleBranchChange =
    async (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const value =
        e.target.value

      const branchName =
        e.target.options[
          e.target.selectedIndex
        ].text

      if (!value) {
        setSelectedBranch('')

        localStorage.removeItem(
          'branch_id'
        )

        localStorage.removeItem(
          'branch_name'
        )

        return
      }

      const canChange =
        await checkCartByBranch(
          value
        )

      if (!canChange) {
        return
      }

      setSelectedBranch(value)

      localStorage.setItem(
        'branch_id',
        value
      )

      localStorage.setItem(
        'branch_name',
        branchName
      )
    }

  return (
    <div className="container mx-auto px-4 py-10">
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
          setCategory('')
        }}
      />

      <div className="mb-4">
        <label>
          Chi nhánh
        </label>

        <select
          value={selectedBranch}
          onChange={
            handleBranchChange
          }
        >
          <option value="">
            Tất cả chi nhánh
          </option>

          {branches.map(
            (branch) => (
              <option
                key={branch.id}
                value={branch.id}
              >
                {branch.name}
              </option>
            )
          )}
        </select>
      </div>

      {keyword && (
        <>
          <h1 className="text-3xl font-bold mb-2">
            Kết quả tìm kiếm
          </h1>

          <p className="text-gray-600 mb-8">
            Từ khóa:{' '}

            <span className="font-medium">
              {keyword}
            </span>
          </p>
        </>
      )}

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
        <div
          onClick={() =>
            setCategory('')
          }
          className={`
            cursor-pointer
            border
            rounded-lg
            p-3
            text-center
            transition
            hover:shadow-lg

            ${category === ''
              ? 'border-blue-600 bg-blue-50'
              : ''
            }
          `}
        >
          <p className="font-medium">
            Tất cả sản phẩm
          </p>
        </div>

        {categories.map(
          (cate) => (
            <div
              key={cate.id}

              onClick={() =>
                setCategory(
                  cate.name
                )
              }

              className={`
                cursor-pointer
                border
                rounded-lg
                p-3
                text-center
                transition
                hover:shadow-lg

                ${category ===
                  cate.name
                  ? 'border-blue-600 bg-blue-50'
                  : ''
                }
              `}
            >
              <img
                src={`http://127.0.0.1:8000/storage/${cate.image}`}

                alt={cate.name}

                loading="lazy"

                className="
                  w-16
                  h-16
                  mx-auto
                  object-cover
                  rounded-full
                "
              />

              <p className="mt-2 text-sm">
                {cate.name}
              </p>
            </div>
          )
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Đang tải sản phẩm...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Không tìm thấy sản phẩm nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      )}

      <button
        onClick={() =>
          setOpen(!open)
        }

        className="
          fixed
          bottom-6
          right-6
          w-16
          h-16
          rounded-full
          bg-blue-600
          text-white
          shadow-xl
          text-3xl
          hover:bg-blue-700
          transition
          z-[9999]
        "
      >
        💬
      </button>

      {open && <ChatBot />}
    </div>
  )
}