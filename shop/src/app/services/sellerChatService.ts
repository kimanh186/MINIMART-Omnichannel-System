import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    Accept: "application/json",
  },
});

export const sellerChatService = {
  getConversation: async () => {
    const response = await axios.get(
      `${API_URL}/seller-chat`,
      authConfig()
    );

    return response.data;
  },

  sendMessage: async (message: string) => {
    const response = await axios.post(
      `${API_URL}/seller-chat/send`,
      {
        message,
      },
      authConfig()
    );

    return response.data;
  },
};