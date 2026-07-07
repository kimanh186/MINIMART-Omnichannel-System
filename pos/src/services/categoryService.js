import httpAxios from "./httpAxios";

export const categoryService = {
  getAll: () => httpAxios.get("/categories"),
};
