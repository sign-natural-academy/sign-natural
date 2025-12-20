// src/lib/auth.js
export function signIn(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user || null));
}
export function signOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
export function getToken() {
  return localStorage.getItem("token") || null;
}
export function getUser() {
  const raw = localStorage.getItem("user");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function getUserRole() {
  const u = getUser();
  return typeof u?.role === "string" ? u.role : null;
}

// Separate checks
export function isAdminRole() {
  return getUserRole() === "admin";
}
export function isSuperuserRole() {
  return getUserRole() === "superuser";
}
export function isAuthed() {
  return !!getToken();
}
