import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 20000, // 20s to allow for retries + fallback
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
