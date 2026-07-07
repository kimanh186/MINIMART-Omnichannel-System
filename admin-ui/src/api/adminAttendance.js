import axiosClient from "./axiosClient";

const adminAttendance = {
  getAll(params) {
    return axiosClient.get(
      "/admin/attendance",
      { params }
    );
  },

  approve(id) {
    return axiosClient.post(
      `/admin/attendance/${id}/approve`
    );
  },
  

  update(id, data) {
    return axiosClient.put(
      `/admin/attendance/${id}`,
      data
    );
  },
  delete(id) {
    return axiosClient.delete(
      `/admin/attendance/${id}`
    );
  },
};

export default adminAttendance;