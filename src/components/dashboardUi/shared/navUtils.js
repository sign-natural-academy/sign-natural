// src/components/dashboardUi/shared/navUtils.js
export function getActiveKey(location, defaultKey = "overview") {
  // prefers ?tab=... when present; otherwise falls back to a default
  if (!location) return defaultKey;
  const params = new URLSearchParams(location.search || "");
  return params.get("tab") || defaultKey;
}
