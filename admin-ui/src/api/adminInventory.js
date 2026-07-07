import axiosClient from "./axiosClient";

export const getInventories = (params) =>
  axiosClient.get("/admin/inventories", { params });

export const getInventory = (id) =>
  axiosClient.get(`/admin/inventories/${id}`);

export const getInventoryByProduct = (
  productId,
  branchId
) =>
  axiosClient.get(
    `/admin/inventories/by-product/${productId}`,
    {
      params: {
        branch_id: branchId,
      },
    }
  );
  
export const createInventory = (data) =>
  axiosClient.post("/admin/inventories", data);

export const deleteInventory = (id) =>
  axiosClient.delete(`/admin/inventories/${id}`);

export const printInventories = () =>
  axiosClient.get("/admin/inventories/print");
