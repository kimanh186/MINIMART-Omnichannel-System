import axiosClient from "./axiosClient";

export const getOrders = (params = {}) => {
  return axiosClient.get("/admin/orders", { params });
};

export const getOrderById = (id) => {
  return axiosClient.get(`/admin/orders/${id}`);
};

export const updateOrderStatus = (id, status) => {
  return axiosClient.put(`/admin/orders/${id}/status`, {
    status,
  });
};
