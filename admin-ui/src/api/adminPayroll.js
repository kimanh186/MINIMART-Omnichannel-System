import axiosClient from './axiosClient';

const adminPayroll = {
  getByEmployee(employeeId, params = {}) {
    return axiosClient.get(`/admin/payroll/${employeeId}`, { params });
  },

  closePayroll(data) {
    /**
     * data = {
     *   employee_id,
     *   month,
     *   year
     * }
     */
    return axiosClient.post('/admin/payroll', data);
  },
};

export default adminPayroll;
