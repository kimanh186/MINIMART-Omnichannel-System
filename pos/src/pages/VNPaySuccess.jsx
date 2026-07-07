import { CheckCircle } from "lucide-react";

export default function VNPaySuccess() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          minWidth: "400px",
        }}
      >
        <CheckCircle
          size={80}
          color="#22c55e"
          style={{ marginBottom: "20px" }}
        />

        <h1
          style={{
            marginBottom: "10px",
            color: "#22c55e",
          }}
        >
          Thanh toán thành công
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Đơn hàng đã được thanh toán qua VNPay.
          <br />
          Bạn có thể đóng cửa sổ này.
        </p>

        <button
          onClick={() => window.close()}
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Đóng cửa sổ
        </button>
      </div>
    </div>
  );
}