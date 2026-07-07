import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { XCircle } from 'lucide-react'

export function PaymentFailed() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const orderId = searchParams.get('orderId')

    const handleFailed = async () => {
      if (!orderId) return

      try {
        await fetch(`http://localhost:8813/order/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'FAILED',
          }),
        })
      } catch (error) {
        console.error(error)
      }
    }

    handleFailed()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán thất bại
        </h1>

        <p className="text-gray-600 mb-6">
          Giao dịch VNPay không thành công hoặc đã bị hủy.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Thử lại
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}