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

export default http;
