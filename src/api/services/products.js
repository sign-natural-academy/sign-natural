// src/api/services/products.js
import api from "../../lib/api";

// Public
export const getProducts = (params = {}) => api.get("/api/products", { params });

// Admin
export const createProduct = (formData) =>
  api.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
