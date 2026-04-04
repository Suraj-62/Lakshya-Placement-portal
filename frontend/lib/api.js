import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 🔥 VERY IMPORTANT (cookie send hoga)
});

export default api;