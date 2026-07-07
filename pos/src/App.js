import React, { useEffect, useState } from 'react';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { Header } from './components/Header';
import { PaymentModal } from './components/PaymentModal';
import './index.css';
import { productService } from './services/productService';
import { Login } from './components/Login';
import httpAxios from './services/httpAxios';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pos_token') || null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Load sản phẩm khi có token
  useEffect(() => {
    if (!token) return;

    async function loadProducts() {
  try {

    const branchId =
      localStorage.getItem(
        "employee_branch_id"
      );

    const res =
      await productService.getAll(
        token,
        branchId
      );

    console.log(
      "Branch:",
      branchId
    );

    console.log(
      "Products API:",
      res.data
    );

    setProducts(
      Array.isArray(
        res.data.data
      )
        ? res.data.data
        : []
    );

  } catch (err) {
    console.error(
      "Lỗi load sản phẩm:",
      err.response || err
    );
  }
}

    loadProducts();
  }, [token]);

  // Nếu chưa login
  if (!employee) {
    return (
      <Login
        onLogin={(emp, tok) => {
          setEmployee(emp);
          setToken(tok);
          localStorage.setItem('pos_token', tok);
        }}
      />
    );
  }

  // Tính danh mục
  const categories = [
    'all',
    ...Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))),
  ];

  // Cart
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);

  const filteredProducts = products.filter(p => {
    const q = searchTerm.trim().toLowerCase();

    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toString().includes(q));

    const matchCategory =
      selectedCategory === 'all' || p.category?.name === selectedCategory;

    return matchSearch && matchCategory;
  });


  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handleBarcodeSearch = async (code) => {
    try {
      const res = await httpAxios.get(`/products/sku/${code}`);
      const product = res.data.data;

      if (product.stock <= 0) {
        alert("Sản phẩm đã hết hàng!");
        return;
      }

      addToCart(product);
    } catch (err) {
      alert("Không tìm thấy sản phẩm!");
    }
  };



  const handleCheckout = () => setShowPaymentModal(true);
  const handlePaymentComplete = () => {
    clearCart();
    setShowPaymentModal(false);
    // TODO: gọi backend tạo order
  };

  

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <div className="app-root">
        <div className="snow-container"></div>

        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onBarcodeSearch={handleBarcodeSearch}
          employee={employee}
        />

        <div className="app-body">
          <div className="left-col">
            <div className="category-bar">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={selectedCategory === cat ? 'btn-cat active' : 'btn-cat'}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>

            <ProductGrid
              products={filteredProducts}
              onProductClick={addToCart}
            />
          </div>

          <Cart
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
          />
        </div>

        {showPaymentModal && (
          <PaymentModal
            total={total}
            items={cart}
            source="pos"
            employeeId={employee?.id}
employeeName={employee?.full_name || ""}
            branchId={employee?.branch_id}
            onClose={() => setShowPaymentModal(false)}
            onComplete={handlePaymentComplete}
          />
        )}
        
      </div>
    </>
  );

}
