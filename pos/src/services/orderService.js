import httpAxios from './httpAxios';

async function sendOrder(cartItems, cartTotal, employee) {
  if (!cartItems || cartItems.length === 0) {
    console.error('Không có sản phẩm để gửi');
    return;
  }

  const orderData = {
    customer_name: 'Nguyen Van A',
    customer_phone: '0123456789',
    items: cartItems.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price })),
    total: cartTotal,
    payment_method: 'card',
    source: 'pos',
 employee_id:
    employee?.id,

  branch_id:
    employee?.branch_id    
  };

  try {
    const res = await httpAxios.post('pos/orders', orderData);
    console.log('Order created:', res.data);
  } catch (err) {
    console.error('Gửi đơn hàng thất bại:', err.response?.data || err.message);
  }
}

// Gọi ví dụ:
// sendOrder(cartItemsArray, totalAmount, currentEmployee);
