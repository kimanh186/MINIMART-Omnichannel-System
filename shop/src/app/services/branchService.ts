import axios from "axios";

const API_URL =
  "http://localhost:8000/api";

export const getBranches =
  async () => {

    const res =
      await axios.get(
        `${API_URL}/branches`
      );

    return res.data;
};