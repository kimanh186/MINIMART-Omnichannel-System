import { useState } from "react";
import { askAI } from "../services/productService";

import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

export default function ChatBot() {

    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState<any[]>([
        {
            message:
`Xin chào 👋 Tôi là trợ lý AI của MINIMART.

Bạn có thể:
• Chọn một câu hỏi bên dưới.
• Hoặc nhập câu hỏi của mình vào ô chat.

Tôi luôn sẵn sàng hỗ trợ! 😊`,
            sender: "assistant",
            direction: "incoming",
            position: "single",
        },

    ]);
    const quickQuestions = [
        "🛒 Sản phẩm đang bán",
        "💳 Hình thức thanh toán",
        "📦 Theo dõi đơn hàng",
        "👤 Đăng ký tài khoản",
        "🔑 Quên mật khẩu",
        "🏠 Địa chỉ giao hàng",
        "🎁 Khuyến mãi",
        "☎️ Liên hệ",
    ];

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                message: text,
                sender: "user",
                direction: "outgoing",
                position: "single",
            },
        ]);

        try {
            const reply = await askAI(text);

            setMessages((prev) => [
                ...prev,
                {
                    message: reply,
                    sender: "assistant",
                    direction: "incoming",
                    position: "single",
                },
            ]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    message: "Xin lỗi, AI đang bận. Vui lòng thử lại sau.",
                    sender: "assistant",
                    direction: "incoming",
                    position: "single",
                },
            ]);
        }
    };
const handleQuickQuestion = (text: string) => {
  handleSend(text);
};
    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl text-3xl hover:bg-blue-700 transition z-[9999]"
            >
                💬
            </button>
        );
    }

    return (
        <div
            className="fixed bottom-6 right-6 z-[9999]"
            style={{
                width: 360,
                height: 520,
            }}
        >
            <div className="h-full rounded-xl overflow-hidden shadow-2xl border bg-white">
                <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                    <span className="font-semibold">🤖 Trợ lý AI MINIMART</span>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-xl hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                <div style={{ height: "calc(100% - 56px)" }}>
                    <MainContainer>
                        <ChatContainer>
                           <MessageList>
    {messages.map((m, index) => (
        <Message key={index} model={m} />
    ))}

    <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            padding: "10px",
        }}
    >
        {quickQuestions.map((item) => (
            <button
                key={item}
                onClick={() => handleQuickQuestion(item)}
                style={{
                    background: "#e8f1ff",
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    borderRadius: "20px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                }}
            >
                {item}
            </button>
        ))}
    </div>
</MessageList>

<MessageInput
    placeholder="Nhập câu hỏi..."
    onSend={handleSend}
/>
<div
  style={{
    padding: "10px",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    borderTop: "1px solid #eee",
    maxHeight: "110px",
    overflowY: "auto",
  }}
>
  {quickQuestions.map((item) => (
    <button
      key={item}
      onClick={() => handleQuickQuestion(item)}
      style={{
        border: "1px solid #2563eb",
        background: "#fff",
        color: "#2563eb",
        borderRadius: "20px",
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: "12px",
      }}
    >
      {item}
    </button>
  ))}
</div>

<MessageInput
  placeholder="Nhập câu hỏi..."
  onSend={handleSend}
/>
                         
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        </div>
    );
}