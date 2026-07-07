import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const createOrder = async (
  token: string,
  payload: any
) => {
  const res = await axios.post(
    `${API_URL}/web/orders`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};