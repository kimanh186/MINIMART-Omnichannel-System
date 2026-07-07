import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'

export function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useCart()
    useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    const orderId = searchParams.get('orderId')

    const handleSuccess = async () => {
      if (!orderId) return

      try {
        await fetch(`http://localhost:8813/order/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'COMPLETED',
          }),
        })

        await fetch('http://localhost:8813/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: Number(orderId),
            amount: 0,
            method: 'BANKING',
            status: 'PAID',
          }),
        })

        clearCart()

        setTimeout(() => {
          navigate('/')
        }, 3000)
      } catch (error) {
        console.error(error)
      }
    }

    handleSuccess()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán thành công
        </h1>

        <p className="text-gray-600 mb-6">
          Đơn hàng của bạn đã được thanh toán thành công qua VNPay.
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  )
}