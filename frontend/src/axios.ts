import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export { axiosInstance as axios };
