// import { RouterProvider } from 'react-router';
import { RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { router } from './routes';
import ChatBot from './components/ChatBot';
import SellerChat from './components/SellerChat';

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />

      <SellerChat />

      <ChatBot />
    </CartProvider>
  );
}
