// src/api/services/homeVideo.js
import api from "../../lib/api";

// Public
export const getHomeVideo = () => api.get("/api/home-video");

// Admin list
export const adminGetHomeVideos = () => api.get("/api/home-video/admin");

// Admin create (FormData with youtubeUrl OR video file)
export const adminCreateHomeVideo = (formData) =>
  api.post("/api/home-video/admin", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Admin update (title/caption/published)
export const adminUpdateHomeVideo = (id, payload) =>
  api.patch(`/api/home-video/admin/${id}`, payload);

// Admin delete
export const adminDeleteHomeVideo = (id) =>
  api.delete(`/api/home-video/admin/${id}`);
