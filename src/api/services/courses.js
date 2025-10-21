// src/api/services/courses.js
import api from "../../lib/api";



// Public
export const getCourses = (params = {}) => api.get("/api/courses", { params });
export const getCourseById = (id) => api.get(`/api/courses/${id}`);

// Admin
export const createCourse = (formData) =>
  api.post("/api/courses", formData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const updateCourse = (id, formData) =>
  api.put(`/api/courses/${id}`, formData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const deleteCourse = (id) =>
  api.delete(`/api/courses/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  