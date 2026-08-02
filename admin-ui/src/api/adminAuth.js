import axiosClient from "./axiosClient"; // chỉnh lại đường dẫn nếu khác thư mục

export const adminLogin = async (username, password) => {
  const res = await axiosClient.post("/admin/login", {
    username,
    password,
  });

  localStorage.setItem("admin_token", res.data.token);
  localStorage.setItem("admin_user", JSON.stringify(res.data.user));

  return res.data;
};

export const adminLogout = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
};
