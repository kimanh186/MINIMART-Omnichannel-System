import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const getAddresses = async (
  token: string
) => {
  const res = await axios.get(
    "http://127.0.0.1:8000/api/customer/addresses",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const createAddress = async (
    token: string,
    data: any
) => {
    const res = await axios.post(
        `${API_URL}/customer/addresses`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
};

export const updateAddress = async (
    token: string,
    id: number,
    data: any
) => {
    const res = await axios.put(
        `${API_URL}/customer/addresses/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
};

export const deleteAddress = async (
    token: string,
    id: number
) => {
    return axios.delete(
        `${API_URL}/customer/addresses/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};