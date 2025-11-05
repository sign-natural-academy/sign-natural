// src/api/services/support.js
import api, { authHeaders } from '../../lib/api';

// User create ticket
export const createTicket = async (payload) => {
  const res = await api.post('/api/support', payload, { headers: authHeaders() }); // 1
  return res.data;                                                                  // 2
};

// User list own tickets
export const listMyTickets = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();                                // 3
  const res = await api.get(`/api/support/me${qs ? `?${qs}` : ''}`, { headers: authHeaders() }); // 4
  return res.data;                                                                  // 5
};

// Admin list tickets
export const listTickets = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  const res = await api.get(`/api/support${qs ? `?${qs}` : ''}`, { headers: authHeaders() }); // 6
  return res.data;
};

// Admin change status
export const updateTicketStatus = async (id, status) => {
  const res = await api.patch(`/api/support/${id}/status`, { status }, { headers: authHeaders() }); // 7
  return res.data;
};

// Admin reply
export const replyToTicket = async (id, text) => {
  const res = await api.post(`/api/support/${id}/reply`, { text }, { headers: authHeaders() }); // 8
  return res.data;
};
