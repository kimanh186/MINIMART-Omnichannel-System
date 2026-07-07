
import httpAxios from './httpAxios';

export const productService = {
  getAll: async (
  token,
  branchId
) => {
  return await httpAxios.get(
    '/products',
    {
      params: {
        branch_id: branchId
      },
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );
},
  getById: async (id, token) => {
    return await httpAxios.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
