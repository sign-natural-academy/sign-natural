// src/api/services/analytics.js
import api, { authHeaders } from '../../lib/api';

// GET /api/analytics/overview?from=&to=
export const getOverview = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();            // 1
  const url = `/api/analytics/overview${qs ? `?${qs}` : ''}`;   // 2 (services explicitly prefix /api)
  const res = await api.get(url, { headers: authHeaders() });   // 3
  return res.data;                                              // 4
};
