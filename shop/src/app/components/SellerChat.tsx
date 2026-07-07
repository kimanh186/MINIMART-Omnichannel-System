import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Send,
  X,
} from "lucide-react";

import { sellerChatService } from "../services/sellerChatService";

type Message = {
  id: number;
  conversation_id: number;
  sender_type: "customer" | "employee";
  sender_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function SellerChat() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>(
    []
  );

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(
    null
  );

  const loadMessages = async () => {
    try {
      const response =
        await sellerChatService.getConversation();

      setMessages(response.messages || []);
    } catch (error) {
      console.error(
        "Lỗi lấy tin nhắn:",
        error
      );
    }
  };

  useEffect(() => {
    if (!open) return;

    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    const content = message.trim();

    if (!content) return;

    try {
      setLoading(true);

      await sellerChatService.sendMessage(
        content
      );

      setMessage("");

      await loadMessages();
    } catch (error: any) {
      console.error(
        "Lỗi gửi tin nhắn:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Bạn cần đăng nhập để Chat với cửa hàng!"
        );

        return;
      }

      alert("Gửi tin nhắn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed
          bottom-24
          right-6
          z-40
          w-14
          h-14
          rounded-full
          bg-green-600
          text-white
          flex
          items-center
          justify-center
          shadow-lg
          hover:bg-green-700
        "
        title="Chat với cửa hàng"
      >
        <MessageCircle size={27} />
      </button>

      {open && (
        <div
          className="
            fixed
            bottom-24
            right-6
            z-50
            w-[380px]
            h-[520px]
            bg-white
            rounded-2xl
            shadow-2xl
            border
            flex
            flex-col
            overflow-hidden
          "
        >
          <div
            className="
              bg-green-600
              text-white
              px-4
              py-3
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h3 className="font-bold">
                Chat với cửa hàng
              </h3>

              <p className="text-xs text-green-100">
                MINIMART hỗ trợ khách hàng
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          <div
            className="
              flex-1
              overflow-y-auto
              p-4
              bg-gray-50
              space-y-3
            "
          >
            {messages.length === 0 ? (
              <div
                className="
                  text-center
                  text-gray-500
                  text-sm
                  mt-10
                "
              >
                <MessageCircle
                  size={40}
                  className="mx-auto mb-3 text-gray-400"
                />

                <p>
                  Bạn chưa có tin nhắn nào.
                </p>

                <p>
                  Hãy gửi tin nhắn cho MINIMART nhé!
                </p>
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${
                    item.sender_type ===
                    "customer"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[75%]
                      px-4
                      py-2
                      rounded-2xl
                      text-sm
                      ${
                        item.sender_type ===
                        "customer"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white border text-gray-800 rounded-bl-sm"
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap">
                      {item.message}
                    </p>

                    <p
                      className={`
                        text-[10px]
                        mt-1
                        ${
                          item.sender_type ===
                          "customer"
                            ? "text-blue-100"
                            : "text-gray-400"
                        }
                      `}
                    >
                      {new Date(
                        item.created_at
                      ).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}

            <div ref={bottomRef} />
          </div>

          <div
            className="
              border-t
              p-3
              flex
              items-center
              gap-2
              bg-white
            "
          >
            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Nhập tin nhắn..."
              className="
                flex-1
                border
                rounded-full
                px-4
                py-2
                outline-none
                focus:border-green-500
              "
            />

            <button
              onClick={handleSend}
              disabled={
                loading || !message.trim()
              }
              className="
                w-10
                h-10
                rounded-full
                bg-green-600
                text-white
                flex
                items-center
                justify-center
                disabled:opacity-50
              "
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}