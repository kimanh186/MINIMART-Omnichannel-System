import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin";

const getToken = () => {
  return localStorage.getItem("admin_token");
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    Accept: "application/json",
  },
});

const adminContact = {
getAll: async (params = {}) => {
  const response = await axios.get(
    `${API_URL}/contacts`,
    {
      ...authConfig(),
      params,
    }
  );

  return response.data;
},

  getById: async (id) => {
    const response = await axios.get(
      `${API_URL}/contacts/${id}`,
      authConfig()
    );

    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axios.put(
      `${API_URL}/contacts/${id}/status`,
      { status },
      authConfig()
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(
      `${API_URL}/contacts/${id}`,
      authConfig()
    );

    return response.data;
  },
};

export default adminContact;