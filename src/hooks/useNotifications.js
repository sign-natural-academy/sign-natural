// src/hooks/useNotifications.js
import { useEffect, useRef, useState } from "react";
import { getToken } from "../lib/auth";
import api from "../lib/api";

// Admin-only event types you want to see in the admin bell
const ADMIN_TYPES = new Set([
  "testimonial_pending_created",
  "testimonial_approved",
  "testimonial_deleted",
  "new_booking",
  "booking_updated",
]);

// Build SSE endpoint base
function getSSEUrl() {
  // Prefer your configured API base; fallback to same-origin
  const base =
    import.meta.env.VITE_API_BASE_URL ||
    window.__API_BASE__ ||
    window.location.origin;
  return `${base.replace(/\/+$/, "")}/api/notifications/stream`;
}

export default function useNotifications({ scope = "user" } = {}) {
  const [items, setItems] = useState([]);     // [{type,message,link,createdAt,...}]
  const [unread, setUnread] = useState(0);
  const [connected, setConnected] = useState(false);

  const esRef = useRef(null);
  const retryRef = useRef(0);
  const pausedRef = useRef(false); // pause when tab hidden

  // Optionally hydrate with recent notifications (not required, but nice)
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    (async () => {
      try {
        const res = await api.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setItems(list.slice(0, 30));
        // You can compute unread from the payload if it includes a read flag
        const u = list.filter((n) => !n.read).length;
        setUnread(u);
      } catch {
        // non-fatal
      }
    })();
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const url = `${getSSEUrl()}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url, { withCredentials: false });
    esRef.current = es;

    let retryTimer = null;

    // Visibility handling: pause count increment when hidden if you like
    const onVis = () => { pausedRef.current = document.hidden; };
    document.addEventListener("visibilitychange", onVis);
    pausedRef.current = document.hidden;

    es.onopen = () => {
      setConnected(true);
      retryRef.current = 0; // reset backoff
    };

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data || "{}");

        // Scope filter
        if (scope === "admin") {
          if (payload.kind !== "admin_board") return;
          if (payload.type && !ADMIN_TYPES.has(payload.type)) return;
        } else {
          // user scope: ignore admin-board noise
          if (payload.kind === "admin_board") return;
        }

        setItems((prev) => [{ ...payload }, ...prev].slice(0, 50));
        if (!pausedRef.current) setUnread((u) => u + 1);
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      // Reconnect with capped exponential backoff
      const base = 1000 * Math.min(30, 2 ** retryRef.current);
      retryTimer = setTimeout(() => {
        retryRef.current += 1;
        // re-mount effect by toggling a key: simplest is just call again via state
        // but here we rely on the effect cleanup + new EventSource in next render
        setConnected(false); // trigger render; effect will re-run because token stable
      }, base);
    };

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      try { es.close(); } catch {}
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [scope]);

  // Public helpers
  const markAllRead = async () => {
    const token = getToken();
    if (!token) return;
    try {
      await api.patch(
        "/api/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnread(0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // non-fatal
    }
  };

  return { items, unread, connected, markAllRead };
}
