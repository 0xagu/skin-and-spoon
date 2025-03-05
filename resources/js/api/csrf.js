import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("CSRF BASE_URL:", BASE_URL);

const csrf = async () => {
  try {
    await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    console.log("CSRF cookie set successfully");
  } catch (error) {
    console.error("Failed to get CSRF cookie:", error);
    throw error;
  }
};

export default csrf;
