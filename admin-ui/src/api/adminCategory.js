import axiosClient from "./axiosClient";

export const getCategories = (keyword, page = 1) =>
    axiosClient.get("/admin/categories", {
        params: {
            keyword,
            page,
        },
    });
    

export const getCategoryById = (id) => {
  return axiosClient.get(`/admin/categories/${id}`);
};

export const createCategory = (data) => {
  return axiosClient.post("/admin/categories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteCategory = (id) => {
  return axiosClient.delete(`/admin/categories/${id}`);
};

export const updateCategory = (id, data) => {
  return axiosClient.post(`/admin/categories/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

};
