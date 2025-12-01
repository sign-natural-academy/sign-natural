// src/lib/api.js
import axios from "axios";
import { getToken, signOut } from "./auth";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||     // preferred (rename your env to this)
  import.meta.env.VITE_API_URL ||          // backward compat with your current var
  // window.__API_BASE__ ||                   // optional global override
  "";                                      // same-origin fallback (proxy or same domain)

const api = axios.create({
  baseURL,
  withCredentials: false,
});

// Handy helper for places you need to pass headers explicitly
export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Attach token automatically
api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Auto sign-out on 401 and redirect to /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // Clear creds and redirect (avoid loops if already on /login)
      const onLogin = location.pathname.startsWith("/login");
      signOut(onLogin ? undefined : "/login");
    }
    return Promise.reject(err);
  }
);

export default api;
