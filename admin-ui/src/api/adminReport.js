import axiosClient from "./axiosClient";

export const getReports = (params) =>
  axiosClient.get("/admin/reports", { params });

export const getReportDetail = (id) =>
  axiosClient.get(`/admin/reports/${id}`);

export const printReports = (params) =>
  axiosClient.get("/admin/reports/print", { params });

export const exportPdfReports = (params) =>
  axiosClient.get("/admin/reports/pdf/export", {
    params,
    responseType: "blob", 
  });


