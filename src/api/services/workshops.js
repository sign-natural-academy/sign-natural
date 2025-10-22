// src/api/services/workshops.js
import api from "../../lib/api";

// Public
export const getWorkshops = (params = {}) => api.get("/api/workshops", { params });
export const getWorkshop = (id) => api.get(`/api/workshops/${id}`);

// Admin (protected)
export const createWorkshop = (formData) =>
  api.post("/api/workshops", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateWorkshop = (id, formData) =>
  api.put(`/api/workshops/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteWorkshop = (id) => api.delete(`/api/workshops/${id}`);
