import axiosClient from "./axiosClient";

export const getCustomers = (params) =>
  axiosClient.get("/admin/user", { params });

export const getCustomerById = (id) =>
  axiosClient.get(`/admin/user/${id}`);

export const updateCustomer = (id, data) => {
  data.append("_method", "PUT");

  return axiosClient.post(`/admin/user/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const deleteCustomer = (id) =>
  axiosClient.delete(`/admin/user/${id}`);
