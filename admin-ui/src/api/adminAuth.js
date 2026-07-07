import axios from "axios";

const API_URL = "http://localhost:8000/api/admin";

export const adminLogin = async (
  username,
  password
) => {
  const res = await axios.post(
    `${API_URL}/login`,
    {
      username,
      password,
    }
  );

  localStorage.setItem(
    "admin_token",
    res.data.token
  );

  localStorage.setItem(
    "admin_user",
    JSON.stringify(res.data.user)
  );

  return res.data;
};

export const adminLogout = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
};