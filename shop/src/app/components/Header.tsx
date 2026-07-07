// import { Link, useNavigate } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { Gem } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { Circle } from 'lucide-react'

import {
  ShoppingCart,
  Store,
  Search,
  Menu,
  X,
  User,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useEffect, useState, useMemo } from 'react'

export function Header() {
  const { getTotalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // const userId = localStorage.getItem('userId')
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')


useEffect(() => {
  const savedUser = localStorage.getItem('user')

  if (savedUser) {
    setUser(JSON.parse(savedUser))
  }
}, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-900 drop-shadow-sm" />
            <span className="text-xl font-bold text-blue-900">KA-MART</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </Link>

            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sản phẩm
            </Link>

            <a
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Về chúng tôi
            </a>

            <a
              href="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Liên hệ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border bg-white">
              <Search className="h-4 w-4 text-gray-600" />

              <input
                type="text"
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/products?search=${encodeURIComponent(search)}`)
                  }
                }}
                className="outline-none text-sm w-40"
              />
            </div>

            {/* Account */}
            <Link
to={user ? '/user' : '/login'}              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}

              <span className="hidden sm:inline text-sm text-gray-700">
{user?.name || 'Tài khoản'}             
 </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />

              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>

              <Link
                to="/#products"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>

              <Link
to={user ? '/user' : '/login'}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
{user?.name || 'Tài khoản'}
              </Link>

              <a
                href="#"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Về chúng tôi
              </a>

              <a
                href="#"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Liên hệ
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}