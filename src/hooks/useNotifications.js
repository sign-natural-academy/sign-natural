// src/hooks/useNotifications.js
import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { getToken } from "../lib/auth";

// Admin-only event types you want shown in the admin bell
const ADMIN_TYPES = new Set([
  "testimonial_pending_created",
  "testimonial_approved",
  "testimonial_deleted",
  "new_booking",
  "booking_updated",
  // include ticket/support related events so admin bell shows them
  "ticket_created",
  "ticket_updated",
  "ticket_status_changed",
]);

function getSSEUrl() {
  const base =
    import.meta.env.VITE_API_BASE_URL ||
    window.__API_BASE__ ||
    window.location.origin;
  return `${base.replace(/\/+$/, "")}/api/notifications/stream`;
}

/** Normalize ANY source (DB row or SSE payload) into a consistent item shape */
function normalizeItem(src, { scope }) {
  const createdAt = src.createdAt || new Date().toISOString();
  const type = src.type || "event";

  // Build a stable id (prefer DB _id/id; fallback to type+timestamp)
  const id = String(src.id || src._id || `${type}:${createdAt}`);

  // Human title
  const title =
    type === "new_booking" ? "New booking" :
    type === "booking_updated" ? "Booking updated" :
    type === "testimonial_pending_created" ? "New story pending" :
    type === "testimonial_approved" ? "Story approved" :
    type === "testimonial_deleted" ? "Story deleted" :
    type === "ticket_created" ? "New support ticket" :
    type === "ticket_updated" ? "Ticket updated" :
    type === "ticket_status_changed" ? "Ticket status changed" :
    src.title || "New activity";

  // prefer explicit action.route if server provided it (keeps backward compatibility)
  const action = src.action || (src.meta && src.meta.action) || undefined;

  // Safe link defaults by scope
  let safeLink =
    src.link ||
    (scope === "admin" ? "/admin-dashboard" : "/user-dashboard");

  // ---------- TICKET MAPPING (scope-aware) ----------
  const ticketId =
    src.ticketId ||
    src.supportId ||
    (src.meta && src.meta.ticketId) ||
    src._ticketId ||
    src._rawTicketId ||
    src.rawTicketId;

  if (ticketId || (typeof type === "string" && type.startsWith("ticket"))) {
    // prefer server-provided route when available
    if (action && action.route) {
      safeLink = action.route;
    } else {
      if (scope === "admin") {
        safeLink = `/admin-dashboard?tab=support`;
      } else {
        // user dashboard help tab
        safeLink = `/user-dashboard?tab=help&ticket=${encodeURIComponent(ticketId || "")}`;
      }
    }
  }

  // ---------- BOOKING MAPPING (user scope only) ----------
  const bookingId =
    src.bookingId ||
    (src.meta && src.meta.bookingId) ||
    src._bookingId ||
    src._bookingid ||
    src._bk ||
    src.booking;

  if (bookingId && scope === "user") {
    // If backend supplied an explicit route, prefer it (backward compatibility)
    if (action && action.route) {
      safeLink = action.route;
    } else {
      // Use top-level tab=bookings for the dashboard and pass 'sub' for inner bookings view
      // e.g.: /user-dashboard?tab=bookings&sub=upcoming&id=<bookingId>
      const sub = (action && action.tab) || src.tab || (src.meta && src.meta.tab) || "upcoming";
      safeLink = `/user-dashboard?tab=bookings&sub=${encodeURIComponent(sub)}&id=${encodeURIComponent(
        bookingId
      )}`;
    }
  }

  return {
    id,
    type,
    title,
    message: src.message || src.text || "",
    link: safeLink,
    createdAt,
    read: Boolean(src.read),
    audience: src.audience || (scope === "admin" ? "admin" : "user"),
    _raw: src, // keep original just in case
  };
}

/** Deduplicate by id while keeping newest first */
function dedupePrepend(list, item, max = 50) {
  const seen = new Set(list.map((x) => x.id));
  if (seen.has(item.id)) return list; // ignore exact dup
  return [item, ...list].slice(0, max);
}

export default function useNotifications({ scope = "user" } = {}) {
  const [items, setItems] = useState([]);   // normalized items
  const [unread, setUnread] = useState(0);
  const [connected, setConnected] = useState(false);

  const esRef = useRef(null);
  const pausedRef = useRef(false); // pause unread increments when tab hidden
  const reconnectKeyRef = useRef(0); // bump to force effect re-run on reconnect

  // Optional: hydrate from REST on mount for recent history
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    (async () => {
      try {
        const res = await api.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = Array.isArray(res.data) ? res.data : [];
        // If your DB rows include audience, filter by it
        const filtered = raw.filter((n) =>
          scope === "admin" ? n.audience === "admin" : n.audience === "user"
        );
        const mapped = filtered.map((row) => normalizeItem(row, { scope }));

        // Deduplicate by id just in case
        const map = new Map();
        for (const m of mapped) map.set(m.id, m);
        const unique = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setItems(unique.slice(0, 50));
        setUnread(unique.filter((n) => !n.read).length);
      } catch {
        // non-fatal
      }
    })();
  }, [scope]);

  // Live SSE stream
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const url = `${getSSEUrl()}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url, { withCredentials: false });
    esRef.current = es;

    const onVis = () => { pausedRef.current = document.hidden; };
    document.addEventListener("visibilitychange", onVis);
    pausedRef.current = document.hidden;

    es.onopen = () => setConnected(true);

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data || "{}");

        // Scope filtering
        if (scope === "admin") {
          if (payload.kind !== "admin_board") return;
          if (payload.type && !ADMIN_TYPES.has(payload.type)) return;
        } else {
          // user scope: ignore admin board events
          if (payload.kind === "admin_board") return;
        }

        const normalized = normalizeItem(payload, { scope });
        setItems((prev) => dedupePrepend(prev, normalized, 50));
        if (!pausedRef.current) setUnread((u) => u + 1);
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setConnected(false);
      try { es.close(); } catch {}
      // trigger a reconnect by bumping a key (re-runs this effect)
      reconnectKeyRef.current += 1;
      setTimeout(() => {
        // force React to re-run effect; simplest is updating state it depends on
        setConnected((c) => c); // noop but ensures a render; dependency is below
      }, Math.min(30000, 1000 * (reconnectKeyRef.current + 1))); // capped backoff
    };

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      try { es.close(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, reconnectKeyRef.current]);

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

  const markOneRead = async (id) => {
    const token = getToken();
    if (!token || !id) return;
    try {
      await api.patch(
        `/api/notifications/${encodeURIComponent(id)}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnread((u) => Math.max(0, u - 1));
    } catch {
      // non-fatal
    }
  };

  return { items, unread, connected, markAllRead, markOneRead };
}
