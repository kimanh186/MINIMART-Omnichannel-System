import httpAxios from "./httpAxios";

const attendanceService = {
  checkIn() {
    return httpAxios.post(
      "/attendance/check-in"
    );
  },

  checkOut() {
    return httpAxios.post(
      "/attendance/check-out"
    );
  },
};

export default attendanceService;