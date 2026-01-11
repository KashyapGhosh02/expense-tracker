import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // ✅ CRITICAL: Send cookies with every request
});

export default api;
