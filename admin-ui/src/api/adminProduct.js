import axiosClient from './axiosClient';

export const getProducts = (params = {}) => {
  return axiosClient.get('/admin/products', { params });
};

export const getProductById = (id) => {
  return axiosClient.get(`/admin/products/${id}`);
};

export const updateProduct = (id, data) => {
  const formData = new FormData();

  formData.append("_method", "PUT");

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (key === "image" && !value) return;

    if (typeof value === "boolean" || typeof value === "number") {
      formData.append(key, value.toString());
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return axiosClient.post(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createProduct = (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (key === "image" && !value) return;

    if (typeof value === "boolean" || typeof value === "number") {
      formData.append(key, value.toString());
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return axiosClient.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = (id) => {
  return axiosClient.delete(`/admin/products/${id}`);
};
