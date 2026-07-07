import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import adminPayroll from "../../api/adminPayroll";

export default function PayrollPage() {
    const navigate = useNavigate();
    const { employeeId } = useParams();
    const [page, setPage] = useState(1);
    const currentYear = new Date().getFullYear();
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [data, setData] = useState(null);

    const fetchPayroll = async () => {
        const res = await adminPayroll.getByEmployee(employeeId, {
            month,
            year,
            page,
        });
        setData(res.data.data);
    };
    useEffect(() => {
        fetchPayroll();
    }, [month, year, page]);
    const GENDER_LABELS = {
        male: "Nam",
        female: "Nữ",
        other: "Khác",
    };
    const ROLE_LABELS = {
        super_admin: "Quản trị viên hệ thống",
        branch_manager: "Quản lý chi nhánh",
        staff: "Nhân viên",
    };

    const formatDateTime = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
        });
    };


    if (!data) return <div className="order-page">Đang tải...</div>;

    const {
        employee,
        total_minutes,
        gross_salary,
        bhxh,
        bhyt,
        bhtn,
        net_salary,
        sessions,
    } = data;
    // const totalWorkedMinutes = sessions.reduce(
    //     (sum, s) => sum + Number(s.worked_minutes || 0),
    //     0
    // );

    // const totalWorkedHours = (totalWorkedMinutes / 60).toFixed(2);




    return (
        <div className="order-page">
            <h2 className="admin-title">
                BẢNG LƯƠNG THÁNG {month}/{year} – {employee.full_name}
            </h2>
            <Link to="/admin/employees" className="btn-back">
                ← Quay lại danh sách
            </Link>

            {/* Thông tin nhân viên */}
            <div className="info-box">
                <div className="info-avatar">
                    {employee.avatar_url ? (
                        <img src={employee.avatar_url} />
                    ) : (
                        <div className="avatar-empty">Không có ảnh</div>
                    )}
                </div>

                <div className="info-grid">
                    <p><b>Họ tên:</b> {employee.full_name}</p>
                    <p><b>Username:</b> {employee.username}</p>
                    <p><b>Vai trò:</b>{" "}{ROLE_LABELS[employee.role] || employee.role} </p>
                    <p>
                        <b>Loại nhân viên:</b>{" "}
                        {employee.employment_type ===
                            "full_time"
                            ? "Toàn thời gian"
                            : "Bán thời gian"}
                    </p>

                    {employee.employment_type ===
                        "part_time" ? (

                        <p>
                            <b>Lương / giờ:</b>{" "}
                            {Number(
                                employee.salary_per_hour || 0
                            ).toLocaleString()}
                            ₫
                        </p>

                    ) : (

                        <p>
                            <b>Lương / tháng:</b>{" "}
                            {Number(
                                employee.salary_per_month || 0
                            ).toLocaleString()}
                            ₫
                        </p>

                    )}
                    <p><b>Giới tính:</b>{" "}{GENDER_LABELS[employee.gender] || "—"}</p>
                    <p><b>Ngày sinh:</b> {employee.birthday || "—"}</p>
                    <p><b>Ngày vào làm:</b> {employee.start_date || "—"}</p>
                    <p><b>Điện thoại:</b> {employee.phone || "—"}</p>
                </div>
            </div>

            {/* Chọn tháng */}
            <div className="filter-row">
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                        </option>
                    ))}
                </select>

                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {Array.from({ length: 6 }, (_, i) => {
                        const y = currentYear - i;
                        return (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        );
                    })}
                </select>
            </div>


            {/* Tổng hợp lương */}
            <table className="salary-table">
                <tbody>
                    <tr><td>Lương / giờ</td><td>{Number(employee.salary_per_hour).toLocaleString()} ₫</td></tr>
                    <tr><td>Tổng giờ làm</td><td>{(total_minutes / 60).toFixed(2)} giờ</td></tr>
                    <tr className="green"><td>Tổng thu nhập</td><td>{gross_salary.toLocaleString()} ₫</td></tr>

                    <tr><td>BHXH</td><td>{bhxh.toLocaleString()} ₫</td></tr>
                    <tr><td>BHYT</td><td>{bhyt.toLocaleString()} ₫</td></tr>
                    <tr><td>BHTN</td><td>{bhtn.toLocaleString()} ₫</td></tr>

                    <tr className="red">
                        <td>Lương thực nhận</td>
                        <td>{net_salary.toLocaleString()} ₫</td>
                    </tr>
                </tbody>
            </table>
            <div className="form-actions">
                <button
                    className="btn-secondary"
                    onClick={() =>
                        navigate(
                            `/admin/attendance?employee=${employee.id}`
                        )
                    }
                >
                    Quản lí chấm công
                </button>

                <button
                    onClick={() => window.print()}
                    className="btn-primary"
                >
                    In bảng lương
                </button>
            </div>
            {/* Chấm công */}
            <div className="print-hide">
                <h3 className="section-title">BẢNG CHẤM CÔNG</h3>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Giờ vào</th>
                            <th>Giờ ra</th>
                            <th>Phút</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">Không có công</td>
                            </tr>
                        )}


                        {sessions.map((s, i) => (
                            <tr key={i}>
                                <td>
                                    {(data.session_meta.current_page - 1) * 10 + i + 1}
                                </td>

                                <td>{formatDateTime(s.check_in)}</td>

                                <td>{formatDateTime(s.check_out)}</td>

                                <td className="text-right">
                                    {s.worked_minutes}
                                </td>

                                <td>
                                    {s.status === "approved"
                                        ? "Đã duyệt"
                                        : "Chờ duyệt"}
                                </td>
                            </tr>
                        ))}
                        <tr className="daily-total">
                            <td colSpan="4" className="text-right font-bold">
                                Tổng giờ làm (tháng)
                            </td>

                            <td className="text-right font-bold text-green">
                                {(total_minutes / 60).toFixed(2)} giờ
                            </td>
                        </tr>

                    </tbody>

                </table>

                {/* phân trang */}
                <div className="pagination">
                    <button
                        disabled={data.session_meta.current_page === 1}
                        onClick={() => setPage(data.session_meta.current_page - 1)}
                    >
                        ‹
                    </button>

                    <span className="page-current">
                        {data.session_meta.current_page}
                    </span>

                    <button
                        disabled={
                            data.session_meta.current_page === data.session_meta.last_page
                        }
                        onClick={() => setPage(data.session_meta.current_page + 1)}
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}
