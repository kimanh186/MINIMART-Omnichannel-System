// import { createBrowserRouter } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { NotFound } from './pages/NotFound';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import { Products } from './pages/Products';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailed } from './pages/PaymentFailed';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { PromotionProducts } from './pages/PromotionProducts';
import { BestSellingProducts } from './pages/BestSellingProducts';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'user', Component: UserPage },
      { path: '*', Component: NotFound },
      { path: 'login', Component: LoginPage },
      { path: 'products', Component: Products },
      { path: 'best-selling', Component: BestSellingProducts, },

      { path: 'promotions', Component: PromotionProducts, },
      { path: 'login', Component: LoginPage },
      { path: 'products', Component: Products },
      { path: 'payment-success', Component: PaymentSuccess },
      { path: 'payment-failed', Component: PaymentFailed },
      { path: 'register', Component: RegisterPage },
      { path: 'forgotPassword', Component: ForgotPasswordPage },

      { path: "/orders", element: <MyOrdersPage /> },
      { path: "/orders/:id", element: <OrderDetailPage /> },

      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },

    ],
  },
]);