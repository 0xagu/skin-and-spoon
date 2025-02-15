import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

// PUBLIC
export default axios.create({
  baseURL: BASE_URL + '/api',
  headers: { 'Content-Type': 'application/json' }
});