import axiosClient from './axiosClient';

const adminEmployee = {
  getAll(params = {}) {
    return axiosClient.get('/admin/employees', { params });
  },

  getById(id) {
    return axiosClient.get(`/admin/employees/${id}`);
  },

  create(data) {
    return axiosClient.post('/admin/employees', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update(id, data) {
    return axiosClient.post(`/admin/employees/${id}?_method=PUT`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete(id) {
    return axiosClient.delete(`/admin/employees/${id}`);
  },
};

export default adminEmployee;
