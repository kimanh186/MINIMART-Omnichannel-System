import axiosClient from "./axiosClient";

const adminBanner = {
  getAll() {
    return axiosClient.get(
      "/admin/banners"
    );
  },

  create(data) {
    return axiosClient.post(
      "/admin/banners",
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
      `/admin/banners/${id}`,
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
      `/admin/banners/${id}`
    );
  },
};

export default adminBanner;