import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaPaperPlane,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import adminConversation from "../api/adminConversation";

export default function ConversationPage() {
  const [conversations, setConversations] =
    useState([]);

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [keyword, setKeyword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const bottomRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const res =
        await adminConversation.getAll();

      setConversations(
        res.data.data || []
      );
    } catch (error) {
      console.error(
        "Lỗi lấy danh sách chat:",
        error
      );
    }
  };

  const fetchConversation = async (id) => {
    try {
      const res =
        await adminConversation.getById(id);

      const conversation =
        res.data.data;

      setSelectedConversation(
        conversation
      );

      setMessages(
        conversation.messages || []
      );

      fetchConversations();
    } catch (error) {
      console.error(
        "Lỗi lấy tin nhắn:",
        error
      );
    }
  };

  useEffect(() => {
    fetchConversations();

    const interval = setInterval(() => {
      fetchConversations();
    }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    const interval = setInterval(() => {
      fetchConversation(
        selectedConversation.id
      );
    }, 3000);

    return () =>
      clearInterval(interval);
  }, [selectedConversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    const content = message.trim();

    if (
      !content ||
      !selectedConversation
    ) {
      return;
    }

    try {
      setLoading(true);

      await adminConversation.reply(
        selectedConversation.id,
        content
      );

      setMessage("");

      await fetchConversation(
        selectedConversation.id
      );
    } catch (error) {
      console.error(
        "Lỗi gửi tin nhắn:",
        error
      );

      alert(
        "Gửi tin nhắn thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations =
    conversations.filter(
      (conversation) => {
        const name =
          conversation.customer?.name ||
          "";

        const phone =
          conversation.customer?.phone ||
          "";

        const email =
          conversation.customer?.email ||
          "";

        const search =
          keyword.toLowerCase();

        return (
          name
            .toLowerCase()
            .includes(search) ||
          phone.includes(keyword) ||
          email
            .toLowerCase()
            .includes(search)
        );
      }
    );

  return (
    <div className="order-page">
      <h2 className="report-title">
        TIN NHẮN KHÁCH HÀNG
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "350px 1fr",
          height: "680px",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* DANH SÁCH KHÁCH */}
        <div
          style={{
            borderRight:
              "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "18px",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px",
              }}
            >
              Cuộc trò chuyện
            </h3>

            <div
              style={{
                position: "relative",
              }}
            >
              <FaSearch
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "#9ca3af",
                }}
              />

              <input
                value={keyword}
                onChange={(e) =>
                  setKeyword(
                    e.target.value
                  )
                }
                placeholder="Tìm khách hàng..."
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "10px 12px 10px 38px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            {filteredConversations.length ===
              0 ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Chưa có cuộc trò chuyện
              </div>
            ) : (
              filteredConversations.map(
                (conversation) => {
                  const active =
                    selectedConversation
                      ?.id ===
                    conversation.id;

                  return (
                    <div
                      key={
                        conversation.id
                      }
                      onClick={() =>
                        fetchConversation(
                          conversation.id
                        )
                      }
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "15px",
                        cursor: "pointer",
                        borderBottom:
                          "1px solid #f3f4f6",
                        background: active
                          ? "#eff6ff"
                          : "#fff",
                      }}
                    >
                      <FaUserCircle
                        size={45}
                        color="#9ca3af"
                      />

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                          }}
                        >
                          <strong>
                            {conversation
                              .customer
                              ?.name ||
                              "Khách hàng"}
                          </strong>

                          {conversation.unread_count >
                            0 && (
                              <span
                                style={{
                                  background:
                                    "#dc2626",
                                  color: "#fff",
                                  borderRadius:
                                    "999px",
                                  minWidth:
                                    "20px",
                                  height:
                                    "20px",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  fontSize:
                                    "11px",
                                  padding:
                                    "0 5px",
                                }}
                              >
                                {
                                  conversation.unread_count
                                }
                              </span>
                            )}
                        </div>

                        <p
                          style={{
                            margin:
                              "5px 0 0",
                            color: "#6b7280",
                            fontSize:
                              "13px",
                            overflow:
                              "hidden",
                            whiteSpace:
                              "nowrap",
                            textOverflow:
                              "ellipsis",
                          }}
                        >
                          {conversation
                            .latest_message
                            ?.message ||
                            "Chưa có tin nhắn"}
                        </p>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>

        {/* KHUNG CHAT */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!selectedConversation ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <FaUserCircle
                size={80}
                color="#d1d5db"
              />

              <p>
                Chọn khách hàng để xem
                tin nhắn
              </p>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div
                style={{
                  height: "75px",
                  padding: "0 22px",
                  borderBottom:
                    "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FaUserCircle
                  size={45}
                  color="#9ca3af"
                />

                <div>
                  <strong>
                    {selectedConversation
                      .customer?.name ||
                      "Khách hàng"}
                  </strong>

                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      marginTop: "3px",
                    }}
                  >
                    {selectedConversation
                      .customer?.phone ||
                      selectedConversation
                        .customer?.email}
                  </div>
                </div>
              </div>

              {/* TIN NHẮN */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px",
                  background: "#f8fafc",
                }}
              >
                {messages.map((item) => {
                  const isEmployee =
                    item.sender_type ===
                    "employee";

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent:
                          isEmployee
                            ? "flex-end"
                            : "flex-start",
                        marginBottom:
                          "12px",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "65%",
                          padding:
                            "10px 14px",
                          borderRadius:
                            "15px",
                          background:
                            isEmployee
                              ? "#2563eb"
                              : "#fff",
                          color: isEmployee
                            ? "#fff"
                            : "#111827",
                          border: isEmployee
                            ? "none"
                            : "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            whiteSpace:
                              "pre-wrap",
                          }}
                        >
                          {item.message}
                        </div>

                        <div
                          style={{
                            fontSize: "10px",
                            marginTop: "5px",
                            color: isEmployee
                              ? "#dbeafe"
                              : "#9ca3af",
                            textAlign:
                              "right",
                          }}
                        >
                          {new Date(
                            item.created_at
                          ).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={bottomRef} />
              </div>

              {/* Ô TRẢ LỜI */}
              <div
                style={{
                  padding: "15px",
                  borderTop:
                    "1px solid #e5e7eb",
                  display: "flex",
                  gap: "10px",
                  background: "#fff",
                }}
              >
                <input
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      handleSend();
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  style={{
                    flex: 1,
                    padding:
                      "11px 15px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius:
                      "20px",
                    outline: "none",
                  }}
                />

                <button
                  onClick={handleSend}
                  disabled={
                    loading ||
                    !message.trim()
                  }
                  className="btn-primary"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius:
                      "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    padding: 0,
                  }}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}