import axiosClient from "./axiosClient";

const dashboardApi = {
  getData() {
    return axiosClient.get(
      "/admin/dashboard"
    );
  },
};

export default dashboardApi;