// src/api/services/userSettings.js
import api, { authHeaders } from "../../lib/api";

// Get current user's settings
export const getUserSettings = () => {
  const headers = authHeaders();
  // console.log("[debug] userSettings.getUserSettings headers:", headers && (headers.Authorization ? `${headers.Authorization.slice(0,40)}...` : headers));
  return api.get("/api/user-settings", { headers });
};

// Update current user's settings
export const updateUserSettings = (payload) => {
  const headers = authHeaders();
  // console.log("[debug] userSettings.updateUserSettings headers:", headers && (headers.Authorization ? `${headers.Authorization.slice(0,40)}...` : headers));
  return api.patch("/api/user-settings", payload, { headers });
};
