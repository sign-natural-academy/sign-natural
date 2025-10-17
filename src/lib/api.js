// src/lib/api.js
import axios from "axios";
import { getToken, signOut } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Set this to your Render base URL in Netlify env
  withCredentials: false,
});

export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // auto sign out on 401 invalid token
    const status = err?.response?.status;
    if (status === 401) {
      // avoid infinite loops when already on login
      const isAuthPage = window.location.pathname.startsWith("/login");
      if (!isAuthPage) signOut("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
