import { useEffect, useState, Fragment } from "react";
import { getReports } from "../api/adminReport";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSearch } from "react-icons/fa";
import axiosClient from "../api/axiosClient";

function ReportPage() {
  const user = JSON.parse(
    localStorage.getItem("admin_user")
  );
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [lastPage, setLastPage] = useState(1);
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

  const fetchReports = async (
    sDate = startDate,
    eDate = endDate,
    p = page,
    bId = branchId
  ) => {
    try {
      const res = await getReports({
        start_date: sDate,
        end_date: eDate,
        branch_id: bId,
        page: p,
      });

      setReports(res.data.data || []);
      setPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
      setSummary({
        totalOrders: res.data.total_orders || 0,
        totalQuantity: res.data.total_quantity || 0,
        totalRevenue: res.data.total_revenue || 0,
        totalProfit: res.data.total_profit || 0,
      });
    } catch (err) {
      console.error(err);
      alert("Lấy báo cáo thất bại");
    }
  };

  useEffect(() => {
    fetchReports(
      startDate,
      endDate,
      page,
      branchId
    );
  }, [
    page,
    startDate,
    endDate,
    branchId
  ]);

  useEffect(() => {
    axiosClient.get("/branches").then((res) => {

      if (user?.role === "branch_manager") {

        const currentBranch =
          res.data.find(
            b => b.id === user.branch_id
          );

        setBranches(
          currentBranch
            ? [currentBranch]
            : []
        );

        setBranchId(
          String(user.branch_id)
        );

      } else {

        setBranches(res.data);

      }

    });
  }, []);

  const groupedReports = reports.reduce((acc, r) => {
    const date = new Date(r.report_date).toLocaleDateString("vi-VN");
    if (!acc[date]) acc[date] = [];
    acc[date].push(r);
    return acc;
  }, {});

  return (
    <div className="order-page">
      <h2 className="report-title">DANH SÁCH BÁO CÁO</h2>

      <div className="report-toolbar">
        <div className="report-filter">
          <label>Chi nhánh</label>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
            {user?.role === "super_admin" && (
              <option value="">
                Tất cả
              </option>
            )}
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="report-filter">
          <label>Từ ngày</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="report-filter">
          <label>Đến ngày</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>


        <button
          className="btn-primary"
          onClick={() => {
            const params = new URLSearchParams({
              start_date: startDate,
              end_date: endDate,
              branch_id: branchId,
            }).toString();

            window.open(`/reports/print?${params}`, "_blank");
          }}
        >
          Xem & In
        </button>
      </div>

      <div className="report-summary">
        <h3>Tổng doanh thu</h3>
        <div className="summary-grid">
          <div>
            <strong>Tổng đơn:</strong> {summary.totalOrders}
          </div>
          <div>
            <strong>SL bán ra:</strong> {summary.totalQuantity}
          </div>
          <div>
            Doanh thu:{" "}
            <span className="text-green">{formatMoney(summary.totalRevenue)}</span>
          </div>
          <div>
            Lợi nhuận:{" "}
            <span className="text-red">{formatMoney(summary.totalProfit)}</span>
          </div>
        </div>
      </div>
      {(startDate || endDate || branchId) && (
        <div className="result-count">
          Tìm kiếm cho ra {reports.length} kết quả
        </div>
      )}

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
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(groupedReports).map(([date, dayReports], idx) => {
              let dailyOrders = 0;
              let dailyRevenue = 0;

              dayReports.forEach((r) => {
                dailyOrders += Number(r.total_orders || 0);
                dailyRevenue += Number(r.revenue || 0);
              });

              return (
                <Fragment key={idx}>
                  <tr className="daily-header">
                    <td colSpan="9">Ngày: {date}</td>
                  </tr>

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
                      <td>
                        <button
                          className="btn-icon"
                          onClick={() => navigate(`/reports/${r.id}`)}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr className="daily-total">
                    <td colSpan="9">
                      Tổng ngày {date}: Số đơn {dailyOrders}, Tổng tiền{" "}
                      {formatMoney(dailyRevenue)}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => fetchReports(startDate, endDate, page - 1, branchId)}
        >
          &laquo;
        </button>

        {Array.from({ length: lastPage }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => fetchReports(startDate, endDate, i + 1, branchId)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === lastPage}
          onClick={() => fetchReports(startDate, endDate, page + 1, branchId)}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}

export default ReportPage;