// src/api/services/products.js
import api,{authHeaders} from "../../lib/api";

// Public
export const getProducts = (params = {}) => api.get("/api/products", { params });

// Admin
export const createProduct = (formData) =>
  api.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  export const updateProduct = (id, formData) =>
  api.patch(`/api/products/${encodeURIComponent(id)}`, formData, {
    headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) =>
  api.delete(`/api/products/${encodeURIComponent(id)}`, { headers: authHeaders() });
