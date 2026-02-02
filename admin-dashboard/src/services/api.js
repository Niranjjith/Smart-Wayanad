import axios from "axios";

// Vite injects at build time. Production: set VITE_API_BASE_URL on Vercel to https://smart-wayanad.onrender.com/api
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, ""); // no trailing slash

// Socket.IO needs origin without /api (e.g. https://smart-wayanad.onrender.com)
export const SOCKET_URL =
  API_BASE_URL.replace(/\/api\/?$/, "") || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20s to allow for retries + fallback
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
