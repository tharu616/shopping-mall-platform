// src/api/http.ts
import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: false
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.data?.message) err.message = err.response.data.message;
    else if (err?.response?.status) err.message = `HTTP ${err.response.status}`;
    return Promise.reject(err);
  }
);

export default http;
