// src/api/services/audit.js
import api, { authHeaders } from '../../lib/api';              // 1) Use shared axios + auth headers

/**
 * Fetch paginated audit logs with optional filters.
 * GET /api/audit?actor=&action=&entityType=&from=&to=&page=&limit=
 */
export const fetchAuditLogs = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();          // 2) Build querystring
  const url = `/api/audit${qs ? `?${qs}` : ''}`;              // 3) Explicit /api prefix
  const res = await api.get(url, { headers: authHeaders() }); // 4) Auth
  return res.data;                                            // 5) Return JSON {items, page, limit, total, pages}
};
