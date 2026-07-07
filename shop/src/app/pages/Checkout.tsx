import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Building2, Banknote, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { createOrder } from '../services/orderService';
import { getProfile } from "../services/authService";
import { getAddresses, createAddress } from '../services/addresses';

export function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    is_default: false,
  });
  const branchId =
    localStorage.getItem("branch_id") || "";

  const branchName =
    localStorage.getItem("branch_name") || "";
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });

  useEffect(() => {
    loadUserInfo();
  }, []);


  const loadUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const user = await getProfile(token);

      const addressList = await getAddresses(token);

      setAddresses(addressList);

      const defaultAddress =
        addressList.find(
          (a: any) => a.is_default
        ) || addressList[0];

      if (defaultAddress) {
        setFormData((prev) => ({
          ...prev,
          address: defaultAddress.address,
          city: defaultAddress.city,
          district: defaultAddress.district,
          ward: defaultAddress.ward,
          fullName: defaultAddress.full_name,
          phone: defaultAddress.phone,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAddress = async () => {
    try {
      const token =
        localStorage.getItem('token');

      if (!token) {
        toast.error('Bạn cần đăng nhập');
        return;
      }

      if (
        !newAddress.full_name ||
        !newAddress.phone ||
        !newAddress.address
      ) {
        toast.error(
          'Vui lòng nhập đầy đủ thông tin địa chỉ'
        );

        return;
      }

      await createAddress(
        token,
        newAddress
      );

      toast.success(
        'Thêm địa chỉ thành công'
      );

      const addressList =
        await getAddresses(token);

      setAddresses(addressList);

      setNewAddress({
        full_name: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        is_default: false,
      });

      setShowAddAddress(false);
    } catch (error) {
      console.error(error);

      toast.error(
        'Không thể thêm địa chỉ'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        !formData.fullName ||
        !formData.phone ||
        !formData.address
      ) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Bạn cần đăng nhập");
        navigate("/login");
        return;
      }

      const payload = {
        branch_id: branchId,

        customer_name: formData.fullName,
        customer_phone: formData.phone,

        receiver_name: formData.fullName,
        receiver_phone: formData.phone,

        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_district: formData.district,
        shipping_ward: formData.ward,

        total: getTotalPrice(),

        payment_method:
          paymentMethod === "cod"
            ? "cash"
            : "vnpay",

        source: "web",

        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // COD
      if (paymentMethod === "cod") {
        const result = await createOrder(
          token,
          payload
        );

        toast.success(
          `Đặt hàng thành công. Mã đơn #${result.order_id}`
        );

        clearCart();
        navigate("/");
        return;
      }

      // VNPay
      if (paymentMethod === "bank") {
        const order = await createOrder(
          token,
          payload
        );

        const res = await fetch(
          "http://127.0.0.1:8000/api/payment/vnpay/create",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              order_id: order.order_id,
              amount: getTotalPrice(),
              source: "web"
            }),
          }
        );

        const data = await res.json();

        window.location.href =
          data.payment_url;

        return;
      }


      toast.error(
        "Phương thức thanh toán chưa được hỗ trợ"
      );

    } catch (error) {
      console.error(error);
      toast.error(
        "Không thể xử lý đơn hàng"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-900 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Quay lại giỏ hàng
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Thanh toán
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Thông tin khách hàng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0123456789"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Chi nhánh giao hàng
                </h2>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">
                    {branchName || "Chưa chọn chi nhánh"}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Địa chỉ giao hàng
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddressModal(true)
                    }
                    className="text-blue-700 hover:underline"
                  >
                    Thay đổi
                  </button>
                </div>
                {showAddressModal && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[600px] max-w-[95vw] max-h-[600px] overflow-y-auto">

                      <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold">
                          Chọn địa chỉ giao hàng
                        </h2>

                        <button
                          type="button"
                          onClick={() =>
                            setShowAddAddress(true)
                          }
                          className="
            px-4
            py-2
            bg-blue-900
            text-white
            rounded-lg
            hover:bg-blue-800
          "
                        >
                          + Thêm địa chỉ
                        </button>
                      </div>

                      {showAddAddress && (
                        <div className="border rounded-xl p-4 mb-5 bg-gray-50">
                          <h3 className="font-semibold mb-4">
                            Thêm địa chỉ mới
                          </h3>

                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Họ và tên"
                              value={newAddress.full_name}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  full_name:
                                    e.target.value,
                                })
                              }
                              className="border rounded-lg px-3 py-2"
                            />

                            <input
                              type="text"
                              placeholder="Số điện thoại"
                              value={newAddress.phone}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  phone:
                                    e.target.value,
                                })
                              }
                              className="border rounded-lg px-3 py-2"
                            />

                            <input
                              type="text"
                              placeholder="Địa chỉ cụ thể"
                              value={newAddress.address}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  address:
                                    e.target.value,
                                })
                              }
                              className="border rounded-lg px-3 py-2 col-span-2"
                            />

                            <input
                              type="text"
                              placeholder="Phường / Xã"
                              value={newAddress.ward}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  ward:
                                    e.target.value,
                                })
                              }
                              className="border rounded-lg px-3 py-2"
                            />

                            <input
                              type="text"
                              placeholder="Quận / Huyện"
                              value={newAddress.district}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  district:
                                    e.target.value,
                                })
                              }
                              className="border rounded-lg px-3 py-2"
                            />

                            <input
                              type="text"
                              placeholder="Tỉnh / Thành phố"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  city:
                                    e.target.value,
                                })
                              }
                              className="border rounded-lg px-3 py-2 col-span-2"
                            />
                          </div>

                          <label className="flex items-center gap-2 mt-4">
                            <input
                              type="checkbox"
                              checked={
                                newAddress.is_default
                              }
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  is_default:
                                    e.target.checked,
                                })
                              }
                            />

                            Đặt làm địa chỉ mặc định
                          </label>

                          <div className="flex justify-end gap-3 mt-4">
                            <button
                              type="button"
                              onClick={() =>
                                setShowAddAddress(false)
                              }
                              className="px-4 py-2 border rounded-lg"
                            >
                              Hủy
                            </button>

                            <button
                              type="button"
                              onClick={handleAddAddress}
                              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                            >
                              Thêm địa chỉ
                            </button>
                          </div>
                        </div>
                      )}

                      {addresses.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Chưa có địa chỉ giao hàng.
                        </div>
                      ) : (
                        addresses.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-xl p-4 mb-3 cursor-pointer hover:border-blue-600"
                            onClick={() => {
                              setFormData(
                                (prev) => ({
                                  ...prev,
                                  fullName:
                                    item.full_name,

                                  phone:
                                    item.phone,

                                  address:
                                    item.address,

                                  city:
                                    item.city,

                                  district:
                                    item.district,

                                  ward:
                                    item.ward,
                                })
                              );

                              setShowAddressModal(
                                false
                              );
                            }}
                          >
                            <div className="flex justify-between gap-4">
                              <div>
                                <p className="font-semibold">
                                  {item.full_name}
                                </p>

                                <p>
                                  {item.phone}
                                </p>

                                <p className="text-gray-600">
                                  {item.address},
                                  {' '}
                                  {item.ward},
                                  {' '}
                                  {item.district},
                                  {' '}
                                  {item.city}
                                </p>
                              </div>

                              {item.is_default && (
                                <span className="h-fit bg-red-100 border border-red-300 text-red-600 px-2 py-1 rounded text-xs">
                                  Mặc định
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressModal(false);
                          setShowAddAddress(false);
                        }}
                        className="mt-4 border border-gray-300 px-5 py-2 rounded-lg"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}

                <div className="border rounded-xl p-4">
                  <p className="font-semibold">
                    {formData.fullName}
                  </p>

                  <p>{formData.phone}</p>

                  <p className="text-gray-600">
                    {formData.address},
                    {formData.ward},
                    {formData.district},
                    {formData.city}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-950"
                    />
                    <Banknote className="h-6 w-6 text-gray-900" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-gray-900">Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-900"
                    />
                    <Building2 className="h-6 w-6 text-gray-900" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-900">Chuyển khoản qua Internet Banking</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-900"
                    />
                    <CreditCard className="h-6 w-6 text-gray-900" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Thẻ tín dụng/ghi nợ</p>
                      <p className="text-sm text-gray-900">Visa, Mastercard, JCB</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={
                          item.image?.startsWith('http')
                            ? item.image
                            : `http://localhost:8810${item.image}`
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-900">
                          x{item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-900">
                    <span>Tạm tính</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-gray-900">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-900">Miễn phí</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-blue-800">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  Đặt hàng
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng việc đặt hàng, bạn đồng ý với
                  <a href="#" className="text-blue-900 hover:underline"> Điều khoản sử dụng</a> của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
