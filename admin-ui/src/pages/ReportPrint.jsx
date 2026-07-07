import { useEffect, useState, Fragment } from "react";
import { getReports } from "../api/adminReport";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useSearchParams } from "react-router-dom";

function ReportPrint({ startDate = "", endDate = "" }) {
  const [searchParams] = useSearchParams();

  const branchId = searchParams.get("branch_id") || "";
  const startDateParam = searchParams.get("start_date") || "";
  const endDateParam = searchParams.get("end_date") || "";
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalQuantity: 0,
    totalRevenue: 0,
    totalProfit: 0,
  });

  const navigate = useNavigate();

  const formatMoney = (value) => {
    if (!value) return "0 đ";
    return Number(value).toLocaleString("vi-VN") + " đ";
  };

  useEffect(() => {
    axiosClient
      .get("/admin/reports/print", {
        params: {
          start_date: startDateParam,
          end_date: endDateParam,
          branch_id: branchId,
        }
      })
      .then((res) => {
        setReports(res.data.data || []);

        setSummary({
          totalOrders: res.data.total_orders || 0,
          totalQuantity: res.data.total_quantity || 0,
          totalRevenue: res.data.total_revenue || 0,
          totalProfit: res.data.total_profit || 0,
        });
      });
  }, [startDateParam, endDateParam, branchId]);


  // Gom nhóm theo ngày
  const groupedReports = reports.reduce((acc, r) => {
    const date = new Date(r.report_date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(r);
    return acc;
  }, {});

  return (
    <div className="report-page">
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => window.print()} className="btn-primary">
          In báo cáo
        </button>
      </div>
      <Link to="/reports" className="btn-back">
        ← Quay lại danh sách
      </Link>
      <h2 className="report-title">BÁO CÁO DOANH THU</h2>

      {/* Tổng hợp */}
      <div className="report-summary">
        <div className="summary-grid">
          <div>Tổng đơn: {summary.totalOrders}</div>
          <div>SL bán ra: {summary.totalQuantity}</div>
          <div>
            Doanh thu: <span className="text-green">{formatMoney(summary.totalRevenue)}</span>
          </div>
          <div>
            Lợi nhuận: <span className="text-red">{formatMoney(summary.totalProfit)}</span>
          </div>
        </div>
      </div>

      {/* Bảng chi tiết */}
      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Chi nhánh</th>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Danh mục</th>
              <th>Số lượng bán</th>
              <th>Doanh thu</th>
              <th>Lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedReports).map(([date, dayReports], idx) => {
              let dailyOrders = 0;
              let dailyRevenue = 0;
              let dailyProfit = 0;

              dayReports.forEach((r) => {
                dailyOrders += Number(r.total_orders || 0);
                dailyRevenue += Number(r.revenue || 0);
                dailyProfit += Number(r.profit || 0);
              });

              return (
                <Fragment key={idx}>
                  {/* Header ngày */}
                  <tr className="daily-header">
                    <td colSpan="9">Ngày: {date}</td>
                  </tr>

                  {/* Chi tiết */}
                  {dayReports.map((r, i) => (
                    <tr key={r.id} className="hover-row">
                      <td>{i + 1}</td>
                      <td>{r.branch?.name}</td>
                      <td>{r.product_id}</td>
                      <td>{r.product_name}</td>
                      <td>{r.category}</td>
                      <td>{r.quantity_sold}</td>
                      <td className="text-green">{formatMoney(r.revenue)}</td>
                      <td className="text-red">{formatMoney(r.profit)}</td>
                    </tr>
                  ))}

                  {/* Tổng ngày */}
                  <tr className="daily-total">
                    <td colSpan="9">
                      Tổng ngày {date}: Số đơn {dailyOrders}, Tổng tiền {formatMoney(dailyRevenue)}, Lợi nhuận {formatMoney(dailyProfit)}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ReportPrint;
