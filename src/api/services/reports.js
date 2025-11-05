// src/api/services/reports.js
import api, { authHeaders } from '../../lib/api';
import fileDownload from 'js-file-download';

/** Always call /api/reports/<type>.csv */
export const downloadReport = async (typeOrEndpoint, params = {}, filename = 'report.csv') => {
  const slug = String(typeOrEndpoint).endsWith('.csv')
    ? String(typeOrEndpoint)
    : `${typeOrEndpoint}.csv`;

  const qs = new URLSearchParams(params).toString();
  const url = `/api/reports/${slug}${qs ? `?${qs}` : ''}`;   // 👈 explicit /api

  const res = await api.get(url, {
    responseType: 'blob',
    headers: authHeaders(),
  });

  const ct = res.headers?.['content-type'] || '';
  if (!ct.includes('text/csv')) {
    let preview = '';
    try {
      preview = typeof res.data.text === 'function' ? await res.data.text() : '';
    } catch {}
    throw new Error(`Expected CSV but received ${ct || 'unknown'}.\nPreview: ${preview.slice(0, 180)}...`);
  }

  fileDownload(res.data, filename);
};
