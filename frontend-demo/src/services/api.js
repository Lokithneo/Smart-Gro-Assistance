// src/services/api.js
import axios from "axios";

export const API = axios.create({
  baseURL: "https://smart-retail-backend.onrender.com/api", // your Render backend URL
});

// Products
export const getProducts = () => API.get("/products");
export const addProduct = (productData) => API.post("/products", productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Stock & Reports (optional)
export const getLowStock = (threshold = 10) => API.get(`/reports/low-stock?threshold=${threshold}`);
export const getExpiringSoon = (days = 30) => API.get(`/reports/expiring-soon?days=${days}`);
export const getTopSelling = (period = "all") => API.get(`/reports/top-selling?period=${period}`);