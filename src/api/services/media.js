// src/api/services/media.js
import api from "../../lib/api";

// GET /api/media?folder=&q=&page=&limit=
export const listMedia = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/api/media${qs ? `?${qs}` : ""}`);
};

// POST /api/media  (formData with file + optional folder)
export const uploadMedia = (formData) => {
  return api.post(`/api/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// DELETE /api/media/:publicId?force=
export const deleteMedia = (publicId, { force = false } = {}) => {
  const qs = force ? '?force=true' : '';
  return api.delete(`/api/media/${encodeURIComponent(publicId)}${qs}`);
};
