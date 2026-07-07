import axiosClient from "./axiosClient";

const adminConversation = {
  getAll() {
    return axiosClient.get(
      "/admin/conversations"
    );
  },

  getById(id) {
    return axiosClient.get(
      `/admin/conversations/${id}`
    );
  },

  reply(id, message) {
    return axiosClient.post(
      `/admin/conversations/${id}/reply`,
      {
        message,
      }
    );
  },
};

export default adminConversation;