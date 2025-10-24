// src/api/services/testimonials.js
import api from "../../lib/api";

// USER (protected)
export const createTestimonial = (formData) =>
  api.post("/api/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// PUBLIC
export const getApprovedTestimonials = () => api.get("/api/testimonials/approved");
export const getMyTestimonials = () => api.get("/api/testimonials/me"); // protected

// ADMIN (protected)
export const getPendingTestimonials = () => api.get("/api/testimonials/pending");
export const approveTestimonial = (id) => api.post(`/api/testimonials/${id}/approve`);
export const deleteTestimonial = (id) => api.delete(`/api/testimonials/${id}`);
