import React, { useState, useEffect } from 'react';
import { X, Banknote, CreditCard, UserPlus } from 'lucide-react';
import httpAxios from '../services/httpAxios';
import { toast } from "react-toastify";

export function PaymentModal({
  total = 0,
  items = [],
  source = 'pos',
  employeeId = null,
  employeeName = "",
  branchId = null,
  onClose = () => { },
  onComplete = () => { }
}) {
  const [method, setMethod] = useState(null);
  const [cash, setCash] = useState("");
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const [orderId, setOrderId] = useState(null);

  const change = cash ? Number(cash) - total : 0;
  const canPay = method && (method !== "cash" || change >= 0);

  // LOAD CUSTOMERS
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await httpAxios.get("/customers");
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Load customers failed", e);
    }
  };

  // POLLING STATUS
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await httpAxios.get(`/orders/${orderId}/status`);
        if (res.data.status === "paid") {
          clearInterval(interval);
          toast.success("Thanh toán VNPay thành công ", {
            autoClose: 2000,
          });
          onComplete();
          onClose();
        }
      } catch (e) {
        console.log("Status check error", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId]);

  // CREATE CUSTOMER
  const createCustomer = async () => {
    if (!newCustomerName) {
      toast.warning("Vui lòng nhập tên khách hàng");
      return;
    }

    const toastId = toast.loading("Đang tạo khách hàng...");

    try {
      const res = await httpAxios.post("/customers", {
        name: newCustomerName,
        phone: newCustomerPhone,
        points: 0
      });

      setSelectedCustomer(res.data);
      setCreatingCustomer(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      loadCustomers();

      toast.update(toastId, {
        render: "Tạo khách hàng thành công ",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

    } catch (e) {
      toast.update(toastId, {
        render: "Tạo khách thất bại ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  const printInvoice = (invoiceOrderId, paymentMethod) => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=500,height=700"
    );

    if (!printWindow) {
      toast.error("Không thể mở cửa sổ in hóa đơn");
      return;
    }

    const invoiceItems = items
      .map(
        (item) => `
        <tr>
          <td>
            ${item.name}
            <div>
              ${Number(item.price).toLocaleString("vi-VN")}đ
            </div>
          </td>

          <td>${item.quantity}</td>

          <td>
            ${Number(
          item.price * item.quantity
        ).toLocaleString("vi-VN")}đ
          </td>
        </tr>
      `
      )
      .join("");

    const cashAmount = Number(cash || 0);
    const changeAmount = cashAmount - Number(total);

    printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="vi">

    <head>
      <meta charset="UTF-8">
      <title>Hóa đơn #${invoiceOrderId}</title>

      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .invoice-print {
          width: 80mm;
          margin: 0 auto;
          padding: 10px;
          font-size: 13px;
        }

        .invoice-center {
          text-align: center;
        }

        .invoice-right {
          text-align: right;
        }

        .invoice-store-name {
          font-size: 22px;
          font-weight: bold;
        }

        .invoice-title {
          font-size: 18px;
          font-weight: bold;
          margin: 15px 0;
        }

        .invoice-line {
          border-top: 1px dashed black;
          margin: 10px 0;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
        }

        .invoice-table th,
        .invoice-table td {
          padding: 6px 2px;
        }

        .invoice-table th {
          border-bottom: 1px solid black;
        }

        .invoice-total {
          font-size: 17px;
          font-weight: bold;
        }

        .invoice-footer {
          text-align: center;
          margin-top: 20px;
        }

        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      </style>
    </head>

    <body>

      <div class="invoice-print">

        <div class="invoice-center">

          <div class="invoice-store-name">
            MINIMART
          </div>

          <div>
            Chi nhánh #${branchId}
          </div>

          <div class="invoice-title">
            HÓA ĐƠN BÁN HÀNG
          </div>

        </div>

        <p>
          <b>Mã hóa đơn:</b>
          #${invoiceOrderId}
        </p>

        <p>
          <b>Ngày:</b>
          ${new Date().toLocaleString("vi-VN")}
        </p>

        <p>
          <b>Khách hàng:</b>
          ${selectedCustomer?.name || "Khách vãng lai"}
        </p>
        
        <p>
  <b>Nhân viên bán hàng:</b>
  ${employeeName || "-"}
</p>

        <p>
          <b>SĐT:</b>
          ${selectedCustomer?.phone || "-"}
        </p>

        <div class="invoice-line"></div>

        <table class="invoice-table">

          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>SL</th>
              <th>Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            ${invoiceItems}
          </tbody>

        </table>

        <div class="invoice-line"></div>

        <p class="invoice-right invoice-total">
          TỔNG:
          ${Number(total).toLocaleString("vi-VN")}đ
        </p>

        <p class="invoice-right">
          Thanh toán:
          ${paymentMethod === "cash" ? "Tiền mặt" : "VNPay"}
        </p>

        ${paymentMethod === "cash"
        ? `
              <p class="invoice-right">
                Tiền khách đưa:
                ${cashAmount.toLocaleString("vi-VN")}đ
              </p>

              <p class="invoice-right">
                Tiền thối:
                ${changeAmount.toLocaleString("vi-VN")}đ
              </p>
            `
        : ""
      }

        <div class="invoice-line"></div>

        <div class="invoice-footer">
          <b>Cảm ơn quý khách!</b>
          <p>Hẹn gặp lại quý khách</p>
        </div>

      </div>

      <script>
        window.onload = function () {
          window.print();

          window.onafterprint = function () {
            window.close();
          };
        };
      </script>

    </body>
    </html>
  `);

    printWindow.document.close();
  };


  const handlePay = async () => {
    if (!canPay || loading) return;

    setLoading(true);

    // toast loading ở giữa màn hình
    const toastId = toast.loading("Đang xử lý thanh toán...");

    try {
      // Tạo đơn hàng
      const orderRes = await httpAxios.post("/pos/orders", {
        customer_name: selectedCustomer?.name || "",
        customer_phone: selectedCustomer?.phone || "",
        items: items.map(i => ({
          product_id: i.id,
          quantity: i.quantity,
          price: i.price
        })),
        total,
        payment_method: method,
        source,
        employee_id: employeeId,
        branch_id: branchId
      });

      const oid = orderRes.data.order_id;
      setOrderId(oid);

      // VNPay
      if (method === "vnpay") {
        const payRes = await httpAxios.post("/payment/vnpay/create", {
          amount: total,
          order_id: oid,
          source: "pos"
        });

        window.open(payRes.data.payment_url, "_blank");

        toast.update(toastId, {
          render: "Vui lòng hoàn tất thanh toán VNPay",
          type: "info",
          isLoading: false,
          autoClose: 3000,
        });

        return;
      }

      // TIỀN MẶT
      toast.update(toastId, {
        render: "Thanh toán tiền mặt thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      printInvoice(oid, method);

      onComplete();
      onClose();

    } catch (e) {
      toast.update(toastId, {
        render: e.response?.data?.message || "Lỗi thanh toán ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  return (
    <div className="modal-backdrop">
      <div className="modal">

        <div className="modal-header">
          <h3>Thanh toán</h3>
          <button className="close" onClick={onClose}><X /></button>
        </div>

        <div className="modal-body">

          <div className="customer-section">
            <label>Khách hàng</label>

            {!creatingCustomer ? (
              <>
                <input
                  placeholder="Tìm tên hoặc SĐT..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <div className="customer-list">
                  {filteredCustomers.map(c => (
                    <div
                      key={c.id}
                      className={`customer-item ${selectedCustomer?.id === c.id ? "selected" : ""}`}
                      onClick={() => setSelectedCustomer(c)}
                    >
                      {c.name} ({c.phone})
                    </div>
                  ))}

                  <button className="btn-create-customer" onClick={() => setCreatingCustomer(true)}>
                    <UserPlus /> Khách mới
                  </button>
                </div>
                {selectedCustomer && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded">
                    <strong>Điểm tích lũy:</strong>{" "}
                    <span className="text-green-700 font-bold">
                      {selectedCustomer.points ?? 0} điểm
                    </span>
                  </div>
                )}

              </>
            ) : (
              <div className="create-customer-form">
                <input
                  placeholder="Tên khách"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}

                />

                <input
                  placeholder="Số điện thoại"
                  value={newCustomerPhone}
                  onChange={e => setNewCustomerPhone(e.target.value)}
                />
                <button onClick={createCustomer}>Tạo</button>
                <button onClick={() => setCreatingCustomer(false)}>Hủy</button>
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div className="total-box">
            <div>Tổng</div>
            <div className="big">{total.toLocaleString("vi-VN")}đ</div>
          </div>

          {/* METHODS */}
          <div className="methods">
            <button
              className={method === "cash" ? "active" : ""}
              onClick={() => setMethod("cash")}
            >
              <Banknote /> Tiền mặt
            </button>

            <button
              className={method === "vnpay" ? "active" : ""}
              onClick={() => setMethod("vnpay")}
            >
              <CreditCard /> VNPay
            </button>
          </div>

          {/* CASH INPUT */}
          {method === "cash" && (
            <div className="cash-input">
              <input
                type="number"
                value={cash}
                onChange={e => setCash(e.target.value)}
                placeholder="Tiền khách đưa"
              />
              <div className={`change ${change >= 0 ? "pos" : "neg"}`}>
                Thối: {change.toLocaleString("vi-VN")}đ
              </div>
            </div>
          )}

          {/* BUTTON */}
          <button
            className={`btn-confirm ${!canPay || loading ? "disabled" : ""}`}
            disabled={!canPay || loading}
            onClick={handlePay}
          >
            {loading ? "Đang xử lý..." : method === "vnpay" ? "Thanh toán VNPay" : "Xác nhận"}
          </button>

        </div>
      </div>
    </div>
  );
}
