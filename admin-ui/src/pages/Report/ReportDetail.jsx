import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getReportDetail } from "../api/adminReport";
import { FaDollarSign, FaChartLine, FaCartPlus, FaBox } from "react-icons/fa";

export default function ReportDetail() {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [orders, setOrders] = useState([]);

    const formatMoney = (value) => (value ? Math.round(value).toLocaleString("vi-VN") + "đ" : "0đ");

    useEffect(() => {
        getReportDetail(id)
            .then(res => {
                setReport(res.data.report);
                setOrders(res.data.orders);
            })
            .catch(err => {
                console.error(err);
                alert("Lấy chi tiết thất bại");
            });
    }, [id]);

    if (!report) return <div className="report-loading">Đang tải...</div>;

    return (
        <div className="order-page">
            <h2 className="report-title">CHI TIẾT BÁO CÁO</h2>

            <Link to="/reports" className="btn-back">
                ← Quay lại danh sách
            </Link>
            {/* Thông tin sản phẩm */}
            <div className="report-card report-product-info">
                <h3 className="report-card-title">Thông tin sản phẩm</h3>
                <div className="report-product-details">
                    <img
                        src={
                            report.product?.image
                                ? `http://localhost:8000/storage/${report.product.image.startsWith("products/") ? report.product.image : "products/" + report.product.image}`
                                : "/no-image.png"
                        }
                        alt={report.product_name}
                        className="report-product-image"
                    />

                    <p><strong>Mã sản phẩm:</strong> {report.product_id}</p>
                    <p><strong>Tên sản phẩm:</strong> {report.product_name}</p>
                    <p><strong>Danh mục:</strong> {report.category}</p>
                </div>
            </div>

            {/* Bốn card thống kê */}
            <div className="report-stats-grid">
                <div className="report-stat-card">
                    <FaDollarSign className="report-stat-icon green" />
                    <div>
                        <p className="report-stat-label">Doanh thu</p>
                        <p className="report-stat-value">{formatMoney(report.revenue)}</p>
                    </div>
                </div>
                <div className="report-stat-card">
                    <FaChartLine className="report-stat-icon green" />
                    <div>
                        <p className="report-stat-label">Lợi nhuận</p>
                        <p className="report-stat-value">{formatMoney(report.profit)}</p>
                    </div>
                </div>
                <div className="report-stat-card">
                    <FaCartPlus className="report-stat-icon green" />
                    <div>
                        <p className="report-stat-label">Số đơn hàng</p>
                        <p className="report-stat-value">{report.total_orders || 0}</p>
                    </div>
                </div>
                <div className="report-stat-card">
                    <FaBox className="report-stat-icon orange" />
                    <div>
                        <p className="report-stat-label">Tồn kho</p>
                        <p className="report-stat-value">{report.inventory_status_text || "Còn hàng"}</p>
                        <p className="report-stat-subtext">Số lượng trong kho</p>
                    </div>
                </div>
            </div>

            {/* Bảng đơn hàng */}
            <div className="report-card report-orders">
                <h3 className="report-card-title">Các đơn hàng trong ngày</h3>
                {orders.length === 0 ? (
                    <p className="report-no-orders">Không có đơn hàng nào.</p>
                ) : (
                    <div className="report-table-wrapper">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Thời gian</th>
                                    <th>Khách hàng</th>
                                    <th>SĐT</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                    <th>Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.order.id}</td>
                                        <td>{new Date(item.order.created_at).toLocaleString()}</td>
                                        <td>{item.order.customer_name}</td>
                                        <td>{item.order.customer_phone}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatMoney(item.price)}</td>
                                        <td className="total-money">{formatMoney(item.quantity * item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
