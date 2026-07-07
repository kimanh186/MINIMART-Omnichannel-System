import { useEffect, useState } from "react";
import { FaEye, FaTrash, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import adminContact from "../api/adminContact";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchContacts = async () => {
    try {
      const response = await adminContact.getAll({
        keyword,
        status,
        page,
      });

      setContacts(response.data || []);
      setPage(response.current_page || 1);
      setLastPage(response.last_page || 1);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách liên hệ:", error);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [keyword, status, page]);

  const handleResolve = async (id) => {
    const toastId = toast.loading(
      "Đang cập nhật trạng thái..."
    );

    try {
      await adminContact.updateStatus(id, "resolved");

      toast.update(toastId, {
        render: "Đã xử lý liên hệ thành công 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      toast.update(toastId, {
        render:
          error.response?.data?.message ||
          "Cập nhật trạng thái thất bại ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Bạn có chắc muốn xóa liên hệ này?"
    );

    if (!confirm) return;

    const toastId = toast.loading(
      "Đang xóa liên hệ..."
    );

    try {
      await adminContact.delete(id);

      toast.update(toastId, {
        render: "Xóa liên hệ thành công 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      toast.update(toastId, {
        render:
          error.response?.data?.message ||
          "Xóa liên hệ thất bại ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const renderStatus = (contactStatus) => {
    if (contactStatus === "resolved") {
      return (
        <span className="level-diamond">
          ✓ Đã xử lý
        </span>
      );
    }

    return (
      <span className="level-gold">
        Chờ xử lý
      </span>
    );
  };

  return (
    <div className="order-page">
      <h2 className="report-title">
        DANH SÁCH LIÊN HỆ
      </h2>

      {/* SEARCH */}
      <div className="admin-toolbar">
        <form
          className="search-item"
          onSubmit={(e) => e.preventDefault()}
        >
          <label>Tên / Email / SĐT / Nội dung</label>

          <input
            placeholder="Nhập từ khóa..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
          />
        </form>

        <div className="search-item">
          <label>Trạng thái</label>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">
              Tất cả trạng thái
            </option>

            <option value="pending">
              Chờ xử lý
            </option>

            <option value="resolved">
              Đã xử lý
            </option>
          </select>
        </div>
      </div>

      <div className="result-count">
        {keyword || status
          ? `Tìm thấy ${total} liên hệ`
          : `Tổng cộng ${total} liên hệ`}
      </div>

      {/* TABLE */}
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Chi nhánh</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Ngày gửi</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {contacts.length === 0 && (
            <tr>
              <td
                colSpan="9"
                className="text-center text-muted"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}

          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.id}</td>

              <td className="font-bold">
                {contact.name}
              </td>

              <td>{contact.email}</td>

              <td>{contact.phone || "—"}</td>

              <td className="font-bold">
                {contact.branch?.name || "—"}
              </td>

              <td>
                {contact.message.length > 45
                  ? `${contact.message.substring(0, 45)}...`
                  : contact.message}
              </td>

              <td>
                {renderStatus(contact.status)}
              </td>

              <td>
                {new Date(
                  contact.created_at
                ).toLocaleString("vi-VN")}
              </td>

              <td>
                <div className="report-actions">
                  <button
                    className="btn-icon btn-view"
                    title="Xem"
                    onClick={() =>
                      setSelectedContact(contact)
                    }
                  >
                    <FaEye />
                  </button>

                  {contact.status === "pending" && (
                    <button
                      className="btn-icon btn-edit"
                      title="Đánh dấu đã xử lý"
                      onClick={() =>
                        handleResolve(contact.id)
                      }
                    >
                      <FaCheck />
                    </button>
                  )}

                  <button
                    className="btn-icon btn-delete"
                    title="Xóa"
                    onClick={() =>
                      handleDelete(contact.id)
                    }
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          &laquo;
        </button>

        {Array.from(
          { length: lastPage },
          (_, i) => (
            <button
              key={i}
              className={
                page === i + 1 ? "active" : ""
              }
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}

        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
        >
          &raquo;
        </button>
      </div>

      {/* MODAL CHI TIẾT */}
      {selectedContact && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "550px",
              maxWidth: "90%",
              borderRadius: "10px",
              padding: "25px",
            }}
          >
            <h2 className="report-title">
              CHI TIẾT LIÊN HỆ
            </h2>

            <div style={{ lineHeight: "2" }}>
              <p>
                <strong>Khách hàng:</strong>{" "}
                {selectedContact.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedContact.email}
              </p>

              <p>
                <strong>Số điện thoại:</strong>{" "}
                {selectedContact.phone}
              </p>
              <p>
                <strong>Chi nhánh liên hệ:</strong>{" "}
                {selectedContact.branch?.name || "—"}
              </p>

              <p>
                <strong>Trạng thái:</strong>{" "}
                {renderStatus(
                  selectedContact.status
                )}
              </p>

              <p>
                <strong>Ngày gửi:</strong>{" "}
                {new Date(
                  selectedContact.created_at
                ).toLocaleString("vi-VN")}
              </p>

              <p>
                <strong>Nội dung:</strong>
              </p>

              <div
                style={{
                  background: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "6px",
                  lineHeight: "1.6",
                }}
              >
                {selectedContact.message}
              </div>
            </div>

            <div
              className="report-actions"
              style={{
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() =>
                  setSelectedContact(null)
                }
              >
                Đóng
              </button>

              {selectedContact.status ===
                "pending" && (
                  <button
                    className="btn-icon btn-edit"
                    title="Đánh dấu đã xử lý"
                    onClick={() =>
                      handleResolve(
                        selectedContact.id
                      )
                    }
                  >
                    <FaCheck />
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}