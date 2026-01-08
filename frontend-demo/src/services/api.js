import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Products
export const getProducts = () => API.get("/products");

// Stock
export const getLowStock = (threshold = 10) => API.get(`/reports/low-stock?threshold=${threshold}`);
export const getExpiringSoon = (days = 30) => API.get(`/reports/expiring-soon?days=${days}`);

// Reports
export const getTopSelling = (period = "all") => API.get(`/reports/top-selling?period=${period}`);
