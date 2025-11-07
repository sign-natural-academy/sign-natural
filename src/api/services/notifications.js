// src/api/services/notifications.js
import api from "../../lib/api";

/* -------------------- User (self) endpoints — unchanged -------------------- */
// GET /api/notifications  -> current user's notifications (unread first)
export const getMyNotifications = () => api.get("/api/notifications");                 // 1

// PATCH /api/notifications/:id/read -> mark ONE as read (self scope)
export const markNotificationRead = (id) => api.patch(`/api/notifications/${id}/read`); // 2

// PATCH /api/notifications/read-all -> mark ALL as read (self scope)
export const markAllNotificationsRead = () => api.patch("/api/notifications/read-all"); // 3


/* ------------------------ Admin management endpoints ------------------------ */
// GET /api/notifications/admin?type=&read=&from=&to=&page=&limit=&q=
export const adminListNotifications = (params = {}) => {                                // 4
  const qs = new URLSearchParams(params).toString();                                    // 5
  return api.get(`/api/notifications/admin${qs ? `?${qs}` : ""}`);                      // 6
};

// PATCH /api/notifications/admin/:id/read  { read: boolean }
export const adminMarkNotificationRead = (id, read = true) =>                           // 7
  api.patch(`/api/notifications/admin/${id}/read`, { read });                           // 8

// PATCH /api/notifications/admin/read-all  { type?, from?, to? }
export const adminMarkAllNotificationsRead = (payload = {}) =>                          // 9
  api.patch(`/api/notifications/admin/read-all`, payload);                              // 10

// DELETE /api/notifications/admin/:id
export const adminDeleteNotification = (id) =>                                          // 11
  api.delete(`/api/notifications/admin/${id}`);                                         // 12
