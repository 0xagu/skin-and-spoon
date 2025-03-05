import axios from "axios";

const sessionApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // no /api if you're using web.php routes
  withCredentials: true,
});

export default sessionApi;
