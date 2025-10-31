// src/api/services/users.js
import api from "../../lib/api";

/**
 * GET /api/auth/users
 * Query: ?search=&role=&page=&limit=
 */
export function listUsers({ search = "", role = "", page = 1, limit = 50 } = {}) {
  return api.get("/api/auth/users", {
    params: {
      ...(search ? { search } : {}),
      ...(role ? { role } : {}),
      page,
      limit,
    },
  });
}

/**
 * PATCH /api/auth/users/:id/role
 * Body: { role: "user" | "admin" }
 * NOTE: only SUPERUSER is allowed (per backend guards)
 */
export function updateUserRole(userId, role) {
  // accept either updateUserRole(id, "admin") or updateUserRole(id, { role: "admin" })
  const nextRole = typeof role === "string" ? role : role?.role;
  return api.patch(`/api/auth/users/${userId}/role`, { role: nextRole });
}

/**
 * PATCH /api/auth/users/:id/status
 * Body: { isActive: boolean }
 * Admin can change USERS; Superuser can change USER/ADMIN (not superuser)
 */
export function updateUserStatus(userId, isActive) {
  // accept either updateUserStatus(id, true) or updateUserStatus(id, { isActive: true })
  const next = typeof isActive === "boolean" ? isActive : Boolean(isActive?.isActive);
  return api.patch(`/api/auth/users/${userId}/status`, { isActive: next });
}

/**
 * DELETE /api/auth/users/:id
 * Soft delete (marks inactive). Same guard rules as status.
 */
export function softDeleteUser(userId) {
  return api.delete(`/api/auth/users/${userId}`);
}
