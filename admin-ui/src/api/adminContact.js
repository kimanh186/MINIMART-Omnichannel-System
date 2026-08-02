import axiosClient from "./axiosClient"; // sửa đường dẫn cho đúng

const adminContact = {
  getAll: async (params = {}) => {
    const response = await axiosClient.get("/admin/contacts", {
      params,
    });

    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/admin/contacts/${id}`);

    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosClient.put(
      `/admin/contacts/${id}/status`,
      { status }
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/admin/contacts/${id}`);

    return response.data;
  },
};

export default adminContact;
