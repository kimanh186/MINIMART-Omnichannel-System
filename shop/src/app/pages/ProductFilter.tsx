import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface ProductFilterProps {
  minPrice: string;
  setMinPrice: (value: string) => void;

  maxPrice: string;
  setMaxPrice: (value: string) => void;

  brand: string;
  setBrand: (value: string) => void;

  brands: any[];

  sort: string;
  setSort: (value: string) => void;

  onReset: () => void;
}

export function ProductFilter({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  brand,
  setBrand,
  brands,
  sort,
  setSort,
  onReset,
}: ProductFilterProps) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="mb-4 px-4 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-50 flex items-center gap-2"
      >
        {showFilter ? (
          <X className="w-4 h-4" />
        ) : (
          <SlidersHorizontal className="w-4 h-4" />
        )}

        {showFilter ? "Đóng lọc" : "Bộ lọc"}
      </button>

      {showFilter && (
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 grid md:grid-cols-5 gap-4">
          <input
            type="number"
            placeholder="Giá từ"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
            className="p-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
            className="p-2 border rounded-lg"
          />

          <div>
            <input
              type="text"
              list="brand-list"
              placeholder="Nhập hoặc chọn thương hiệu..."
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              className="w-full p-2 border rounded-lg"
            />

            <datalist id="brand-list">
              {brands.map((item) => (
                <option
                  key={item.id}
                  value={item.name}
                />
              ))}
            </datalist>
          </div>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="p-2 border rounded-lg"
          >
            <option value="">
              Sắp xếp
            </option>

            <option value="price-asc">
              Giá tăng dần
            </option>

            <option value="price-desc">
              Giá giảm dần
            </option>
          </select>

          <button
            onClick={onReset}
            className="bg-gray-100 rounded-lg px-3 py-2 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      )}
    </>
  );
}