// src/lib/auth.js
// Client-side helpers to read role from localStorage.user or decode a JWT in localStorage.token.
// This is purely a UI helper. Server must enforce RBAC.

export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getUserFromLocal() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getRoleFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = parseJwt(token);
    if (!payload) return null;
    return payload.role || payload.user?.role || payload.data?.role || null;
  } catch {
    return null;
  }
}

export function getUserRole() {
  const localUser = getUserFromLocal();
  if (localUser && localUser.role) return localUser.role;
  return getRoleFromToken();
}

export function isAdminRole() {
  const r = getUserRole();
  return r === "admin" || r === "instructor" || r === "teacher";
}
