// src/api/services/users.js
import api from "../../lib/api";

/**
 * List users (admin)
 * Supports query params: search, role, page, limit
 * Example: listUsers({ search: "sam", role: "admin", page: 1, limit: 50 })
 */
export function listUsers(params = {}) {
  return api.get("/api/auth/users", { params });
}

/**
 * Update a user's role (admin)
 * body: { role: "user" | "admin" }
 */
export function updateUserRole(userId, role) {
  return api.patch(`/api/auth/users/${userId}/role`, { role });
}

/**
 * Update a user's active status (admin)
 * body: { isActive: boolean }
 */
export function updateUserStatus(userId, isActive) {
  return api.patch(`/api/auth/users/${userId}/status`, { isActive });
}

/**
 * Soft delete a user (admin)
 * (sets isActive=false)
 */
export function softDeleteUser(userId) {
  return api.delete(`/api/auth/users/${userId}`);
}

/**
 * (Optional) Get a single user (admin)
 */
export function getUserById(userId) {
  return api.get(`/api/auth/users/${userId}`);
}
