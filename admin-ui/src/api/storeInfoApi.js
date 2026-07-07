import axiosClient from "./axiosClient";

const storeInfoApi = {
  get() {
    return axiosClient.get(
      "/admin/store-info"
    );
  },

  update(data) {
    return axiosClient.put(
      "/admin/store-info",
      data
    );
  },
};

export default storeInfoApi;