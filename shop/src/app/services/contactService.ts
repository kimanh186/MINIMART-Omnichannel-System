import axios from "axios";

const API_URL =
  "http://localhost:8000/api";

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  branch_id: string | number;
  message: string;
}

export const contactService = {
  send: async (data: ContactData) => {
    console.log(
      "CONTACT SEND:",
      data
    );

    const response = await axios.post(
      `${API_URL}/contacts`,
      data,
      {
        headers: {
          Accept: "application/json",
          "Content-Type":
            "application/json",
        },
      }
    );

    return response.data;
  },
};