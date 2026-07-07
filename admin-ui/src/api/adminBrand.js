import axiosClient from "./axiosClient";

const adminBrand = {
  getAll(params = {}) {
    return axiosClient.get(
      "/admin/brands",
      { params }
    );
  },

  getById(id) {
    return axiosClient.get(
      `/admin/brands/${id}`
    );
  },

  create(data) {
    return axiosClient.post(
      "/admin/brands",
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  },

  update(id, data) {
    return axiosClient.post(
      `/admin/brands/${id}?_method=PUT`,
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  },

  delete(id) {
    return axiosClient.delete(
      `/admin/brands/${id}`
    );
  },
};

export default adminBrand;