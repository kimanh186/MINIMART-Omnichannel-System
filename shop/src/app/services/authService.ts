import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const register = async (
  name: string,
  phone: string,
  email: string,
  password: string
) => {
  const res = await axios.post(
    `${API_URL}/customer/register`,
    {
      name,
      phone,
       email,
      password,
    }
  );

  return res.data;
};

export const login = async (
  phone: string,
  password: string
) => {
  const res = await axios.post(
    `${API_URL}/customer/login`,
    {
      phone,
      password,
    }
  );

  return res.data;
};

export const getProfile = async (
  token: string
) => {
  const res = await axios.get(
    `${API_URL}/customer/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const uploadAvatar = async (
  token: string,
  file: File
) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const res = await axios.post(
    `${API_URL}/customer/avatar`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const uploadCover = async (
  token: string,
  file: File
) => {
  const formData = new FormData();

  formData.append("cover", file);

  const res = await axios.post(
    `${API_URL}/customer/cover`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const logout = async (token: string) => {
  return axios.post(
    `${API_URL}/customer/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const changePassword = async (
  token: string,
  oldPassword: string,
  newPassword: string
) => {
  return axios.put(
    `${API_URL}/customer/change-password`,
    {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateProfile = async (
    token: string,
    data: {
        name: string;
        phone: string;
        email: string;
        address: string;
    }
) => {
    const res = await axios.put(
        `${API_URL}/customer/profile`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
};

export const getMyOrders = async (
    token: string
) => {
    const res = await axios.get(
        `${API_URL}/customer/orders`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
};