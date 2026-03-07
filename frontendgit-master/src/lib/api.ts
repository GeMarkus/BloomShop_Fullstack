// src/lib/api.ts
import axios from "axios";

// ให้ชี้ที่ ROOT ของ API เท่านั้น (มี /api เพราะ backend setGlobalPrefix('api'))
const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// (optional) จัดการ error กลาง
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
