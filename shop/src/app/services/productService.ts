import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getProducts = async (params: any) => {
  const res = await axios.get(`${API_URL}/products`, {
    params,
  });

  return res.data;
};


export const getProductById = async (
  id: string,
  branch_id?: string | null
) => {
  const response = await axios.get(
    `http://127.0.0.1:8000/api/products/${id}`,
    {
      params: {
        branch_id,
      },
    }
  )

  return response.data.data
}


export const askAI = async (message: string) => {
    console.log("Sending:", message);

    try {
        const res = await axios.post(
            "http://127.0.0.1:8000/api/chat",
            { message }
        );

        console.log("Response:", res.data);
        return res.data.reply;
    } catch (error: any) {
        console.error("AI Error:", error);
        
        if (error.response) {
            // Server trả về lỗi
            console.error("Server error:", error.response.data);
            throw new Error(error.response.data.message || "Lỗi từ server");
        } else if (error.request) {
            // Không nhận được response
            console.error("No response from server");
            throw new Error("Không thể kết nối đến server");
        } else {
            // Lỗi khác
            throw new Error("Lỗi không xác định");
        }
    }
}

