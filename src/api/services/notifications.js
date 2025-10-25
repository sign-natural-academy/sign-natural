// src/api/services/notifications.js
import api from "../../lib/api";

export const getMyNotifications = () => api.get("/api/notifications");
export const markNotificationRead = (id) => api.patch(`/api/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.patch("/api/notifications/read-all");
