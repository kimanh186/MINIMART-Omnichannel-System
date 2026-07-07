import { useEffect, useState } from "react";
import dashboardApi from "../../api/dashboardApi";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
} from "recharts";

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [showEmployees, setShowEmployees] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await dashboardApi.getData();

            console.log("DASHBOARD:", res.data);
            console.log(
                "MONTHLY:",
                res.data.monthly_revenue_chart
            );

            setData(res.data);
        } catch (err) {
            console.log(
                "STATUS:",
                err.response?.status
            );

            console.log(
                "DATA:",
                err.response?.data
            );

            alert(
                JSON.stringify(
                    err.response?.data
                )
            );
        }
    };

    if (!data) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="dashboard-page">
            <h2 className="report-title">
                DASHBOARD
            </h2>

            {/* THỐNG KÊ */}
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>
                        Doanh thu hôm nay
                    </h3>

                    <p>
                        {Number(
                            data.today_revenue || 0
                        ).toLocaleString()}
                        {" ₫"}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>
                        Doanh thu tháng này
                    </h3>

                    <p>
                        {Number(
                            data.month_revenue || 0
                        ).toLocaleString()}
                        {" ₫"}
                    </p>
                </div>
                <div className="dashboard-card">
                    <h3>
                        Doanh thu 3 tháng gần nhất
                    </h3>

                    <p>
                        {Number(
                            data.three_month_revenue || 0
                        ).toLocaleString("vi-VN")}
                        {" ₫"}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>Đơn hôm nay</h3>

                    <p>
                        {data.today_orders}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>Nhân viên</h3>

                    <p>
                        {data.employees}
                    </p>
                </div>

                <div
                    className="dashboard-card"
                    onClick={() =>
                        setShowEmployees(true)
                    }
                    style={{
                        cursor: "pointer",
                    }}
                >
                    <h3>Đang làm việc</h3>

                    <p>
                        {data.working_employees}
                    </p>
                </div>
            </div>

            {/* BIỂU ĐỒ 7 NGÀY */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(2, 1fr)",
                    gap: "20px",
                    marginTop: "25px",
                }}
            >
                {/* DOANH THU */}
                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.08)",
                        overflowX: "auto",
                    }}
                >
                    <h3
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        Doanh thu 7 ngày gần nhất
                    </h3>

                    <BarChart
                        width={500}
                        height={300}
                        data={
                            data.revenue_chart || []
                        }
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis dataKey="date" />

                        <YAxis
                            tickFormatter={(value) =>
                                `${(
                                    value / 1000
                                ).toLocaleString()}k`
                            }
                        />

                        <Tooltip
                            formatter={(value) => [
                                `${Number(
                                    value
                                ).toLocaleString()} ₫`,
                                "Doanh thu",
                            ]}
                        />

                        <Bar
                            dataKey="revenue"
                            fill="#1d4ed8"
                        />
                    </BarChart>
                </div>

                {/* ĐƠN HÀNG */}
                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.08)",
                        overflowX: "auto",
                    }}
                >
                    <h3
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        Số đơn 7 ngày gần nhất
                    </h3>

                    <LineChart
                        width={500}
                        height={300}
                        data={
                            data.order_chart || []
                        }
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis dataKey="date" />

                        <YAxis
                            allowDecimals={false}
                        />

                        <Tooltip
                            formatter={(value) => [
                                value,
                                "Số đơn",
                            ]}
                        />

                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#16a34a"
                            strokeWidth={3}
                        />
                    </LineChart>
                </div>
            </div>

            {/* BIỂU ĐỒ DOANH THU THEO THÁNG */}
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.08)",
                    gridColumn: "1 / -1",
                    overflowX: "auto",
                }}
            >
                <h3
                    style={{
                        marginBottom: "20px",
                    }}
                >
                    Doanh thu theo tháng năm{" "}
                    {new Date().getFullYear()}
                </h3>

                <BarChart
                    width={1000}
                    height={350}
                    data={
                        data.monthly_revenue_chart || []
                    }
                    margin={{
                        top: 20,
                        right: 30,
                        left: 30,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis dataKey="month" />

                    <YAxis
                        tickFormatter={(value) =>
                            value >= 1000000
                                ? `${(
                                    value / 1000000
                                ).toFixed(1)}tr`
                                : `${(
                                    value / 1000
                                ).toFixed(0)}k`
                        }
                    />

                    <Tooltip
                        formatter={(value) => [
                            `${Number(
                                value
                            ).toLocaleString(
                                "vi-VN"
                            )} ₫`,
                            "Doanh thu",
                        ]}
                    />

                    <Bar
                        dataKey="revenue"
                        fill="#7c3aed"
                        barSize={45}
                    />
                </BarChart>
            </div>
            {/* TOP SẢN PHẨM BÁN CHẠY */}
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.08)",
                    gridColumn: "1 / -1",
                }}
            >
                <h3
                    style={{
                        marginBottom: "20px",
                    }}
                >
                    Top 10 sản phẩm được mua nhiều nhất
                </h3>

                {data.top_products?.length === 0 ? (
                    <p>Chưa có dữ liệu bán hàng</p>
                ) : (
                    <BarChart
                        width={1000}
                        height={420}
                        data={data.top_products || []}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 110,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="name"
                            interval={0}
                            angle={-35}
                            textAnchor="end"
                            height={120}
                            tick={{
                                fontSize: 11,
                            }}
                            tickFormatter={(name) =>
                                name.length > 18
                                    ? `${name.slice(0, 18)}...`
                                    : name
                            }
                        />

                        <YAxis
                            allowDecimals={false}
                        />

                        <Tooltip
                            formatter={(value) => [
                                `${value} sản phẩm`,
                                "Đã bán",
                            ]}
                            labelFormatter={(name) =>
                                `Sản phẩm: ${name}`
                            }
                        />

                        <Bar
                            dataKey="total_sold"
                            fill="#f97316"
                            barSize={45}
                        />
                    </BarChart>
                )}
            </div>

            {/* SẮP HẾT HÀNG */}
            <div className="low-stock-box">
                <h3>Sắp hết hàng</h3>

                <ul>
                    {(data.low_stock || []).map(
                        (item) => (
                            <li key={item.id}>
                                {item.product?.name}
                                {" - "}
                                {item.stock_quantity}
                            </li>
                        )
                    )}
                </ul>
            </div>

            {/* MODAL NHÂN VIÊN */}
            {showEmployees && (
                <div
                    className="attendance-modal"
                    onClick={() =>
                        setShowEmployees(false)
                    }
                >
                    <div
                        className="attendance-modal-content"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <h3>
                                Nhân viên đang làm việc
                            </h3>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowEmployees(
                                        false
                                    )
                                }
                            >
                                ✕
                            </button>
                        </div>

                        {(data.working_employee_list || [])
                            .length === 0 ? (
                            <p>
                                Không có nhân viên nào
                                đang làm việc
                            </p>
                        ) : (
                            <ul>
                                {(
                                    data.working_employee_list ||
                                    []
                                ).map(
                                    (
                                        name,
                                        index
                                    ) => (
                                        <li
                                            key={index}
                                        >
                                            {name}
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}