// src/api/services/settings.js
import api, { authHeaders } from '../../lib/api';

// GET /api/settings
export const getSettings = async () => {                                  // 1
  const res = await api.get('/api/settings', { headers: authHeaders() });  // 2
  return res.data;                                                         // 3
};

// PATCH /api/settings  (multipart/form-data)
export const updateSettings = async (payload) => {                         // 4
  const form = new FormData();                                             // 5
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'logo' && v instanceof File) { form.append('logo', v); }     // 6
    else form.append(k, v);                                                // 7
  });

  const res = await api.patch('/api/settings', form, {                     // 8
    headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },  // 9
  });
  return res.data;                                                         // 10
};
