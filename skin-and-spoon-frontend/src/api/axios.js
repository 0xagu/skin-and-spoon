import axios from "axios";
const { REACT_APP_API_ENDPOINT } = process.env;

const BASE_URL = REACT_APP_API_ENDPOINT;

// PUBLIC
export default axios.create({
  baseURL: BASE_URL + '/api',
  headers: { 'Content-Type': 'application/json' }
});