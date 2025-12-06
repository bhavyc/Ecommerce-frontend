import axios from "axios";

// Backend URL set kar raha hu
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Tere server ka URL
});

// 🧐 CONCEPT: Interceptors
// Har request jaane se pehle yeh check karega ki Token hai ya nahi.
// Agar token hai, toh header mein 'Bearer token' laga dega.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // LocalStorage se token nikalo
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;