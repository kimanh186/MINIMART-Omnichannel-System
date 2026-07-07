import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import adminAttendance from "../../api/adminAttendance";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

export default function AttendancePage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");

  const [searchParams] = useSearchParams();

  const employeeId =
    searchParams.get("employee");

  useEffect(() => {
    fetchData();
  }, [employeeId, searchKeyword, fromDate, toDate, status]);

  const fetchData = async () => {
    const res = await adminAttendance.getAll({
      employee_id: employeeId,
      keyword: searchKeyword,
      from_date: fromDate,
      to_date: toDate,
      status,
    });

    setItems(res.data.data || []);
  };
  const formatWorkTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours} giờ ${mins} phút`;
  };

  const toLocalDateTime = (dateString) => {
    const date = new Date(dateString);

    date.setMinutes(
      date.getMinutes() - date.getTimezoneOffset()
    );

    return date
      .toISOString()
      .slice(0, 16);
  };

  const openEdit = (item) => {
    setEditing(item);

    setCheckIn(
      toLocalDateTime(item.check_in)
    );

    setCheckOut(
      item.check_out
        ? toLocalDateTime(item.check_out)
        : ""
    );
  };

  const saveEdit = async () => {
    try {
      await adminAttendance.update(
        editing.id,
        {
          check_in: checkIn,
          check_out: checkOut,
        }
      );

      toast.success(
        "Sửa công thành công"
      );

      setEditing(null);

      fetchData();
    } catch {
      toast.error(
        "Sửa công thất bại"
      );
    }
  };

  const approveAttendance = async (id) => {
    try {
      await adminAttendance.approve(id);

      toast.success("Duyệt công thành công");

      fetchData();
    } catch {
      toast.error("Duyệt công thất bại");
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleString(
      "vi-VN"
    );
  };
  const STATUS_LABELS = {
    approved: "Đã duyệt",
    pending: "Chờ duyệt",
    rejected: "Từ chối",
  };

  const deleteAttendance = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa phiên chấm công này?"
      )
    ) {
      return;
    }

    try {
      await adminAttendance.delete(id);

      toast.success(
        "Xóa công thành công"
      );

      fetchData();
    } catch {
      toast.error(
        "Xóa công thất bại"
      );
    }
  };

  return (
    <div className="order-page">
      <h2 className="report-title">
        QUẢN LÍ CHẤM CÔNG
      </h2>
      {editing && (
        <div
          className="attendance-modal"
          onClick={() => setEditing(null)}
        >
          <div
            className="attendance-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Sửa thời gian chấm công</h2>

              <button
                className="modal-close"
                onClick={() => setEditing(null)}
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>Giờ vào</label>
              <input
                type="datetime-local"
                value={checkIn}
                onChange={(e) =>
                  setCheckIn(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Giờ ra</label>
              <input
                type="datetime-local"
                value={checkOut}
                onChange={(e) =>
                  setCheckOut(e.target.value)
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={saveEdit}
              >
                Lưu thay đổi
              </button>

              <button
                className="btn-secondary"
                onClick={() =>
                  setEditing(null)
                }
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="filter-row">
        <input
          type="text"
          placeholder="Tên hoặc username..."
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchKeyword(keyword);
            }
          }}
        />

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(e.target.value)
          }
        />
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">
            Tất cả trạng thái
          </option>

          <option value="pending">
            Chờ duyệt
          </option>

          <option value="approved">
            Đã duyệt
          </option>

          <option value="rejected">
            Từ chối
          </option>
        </select>

        <button
          className="btn-primary"
          onClick={() =>
            setSearchKeyword(keyword)
          }
        >
          Tìm kiếm
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            setKeyword("");
            setSearchKeyword("");
            setFromDate("");
            setToDate("");
            setStatus("");
          }}
        >
          Xóa lọc
        </button>
      </div>

      <div
        style={{
          marginBottom: 12,
          color: "#64748b",
        }}
      >
        Tìm thấy {items.length} phiên chấm công
      </div>
      <table className="report-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Giờ vào</th>
            <th>Giờ ra</th>
            <th>Thời gian làm</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div>
                  <strong>
                    {item.employee?.full_name}
                  </strong>
                </div>

                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  @{item.employee?.username}
                </small>
              </td>

              <td>
                {formatDateTime(
                  item.check_in
                )}
              </td>

              <td>
                {formatDateTime(
                  item.check_out
                )}
              </td>

              {/* <td>
                {item.worked_minutes}
              </td> */}
              <td>
                {formatWorkTime(item.worked_minutes)}
              </td>

              <td
                className={
                  item.status === "approved"
                    ? "text-green"
                    : item.status === "pending"
                      ? "text-orange"
                      : "text-red"
                }
              >
                {STATUS_LABELS[item.status]}
              </td>

              <td>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <button
                    className="btn-icon"
                    onClick={() =>
                      openEdit(item)
                    }
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="btn-icon btn-delete"
                    onClick={() =>
                      deleteAttendance(item.id)
                    }
                  >
                    <FaTrash />
                  </button>

                  {item.status === "pending" && (
                    <button
                      className="btn-primary"
                      onClick={() =>
                        approveAttendance(item.id)
                      }
                    >
                      Duyệt
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

