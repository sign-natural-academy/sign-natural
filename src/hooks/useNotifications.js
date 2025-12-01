// src/hooks/useNotifications.js
import { useEffect, useRef, useState, useCallback } from "react";
import api from "../lib/api";
import { getToken } from "../lib/auth";

// Admin-only event types shown in admin bell
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

  // prefer explicit action.route if server provided it
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
    if (action && action.route) {
      safeLink = action.route;
    } else {
      if (scope === "admin") {
        safeLink = `/admin-dashboard?tab=support`;
      } else {
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
    if (action && action.route) {
      safeLink = action.route;
    } else {
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
    _raw: src,
  };
}

/** Deduplicate by id while keeping newest first */
function dedupePrepend(list, item, max = 50) {
  const seen = new Set(list.map((x) => x.id));
  if (seen.has(item.id)) return list; // ignore exact dup
  return [item, ...list].slice(0, max);
}

/**
 * useNotifications
 * options:
 *  - scope: "user" | "admin"
 *  - onEvent: optional callback(payload) for live SSE messages
 */
export default function useNotifications({ scope = "user", onEvent } = {}) {
  const [items, setItems] = useState([]);   // normalized items
  const [unread, setUnread] = useState(0);
  const [connected, setConnected] = useState(false);

  const esRef = useRef(null);
  const pausedRef = useRef(false); // pause unread increments when tab hidden

  // reconnectTick toggles to force re-setup (safe primitive in deps)
  const [reconnectTick, setReconnectTick] = useState(0);

  // Hydrate from REST on mount / when scope changes
  useEffect(() => {
    let mounted = true;
    const token = getToken();
    if (!token) return; // unauthenticated

    (async () => {
      try {
        const res = await api.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        const raw = Array.isArray(res.data) ? res.data : [];
        const filtered = raw.filter((n) =>
          scope === "admin" ? n.audience === "admin" : n.audience === "user"
        );
        const mapped = filtered.map((row) => normalizeItem(row, { scope }));

        const map = new Map();
        for (const m of mapped) map.set(m.id, m);
        const unique = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setItems(unique.slice(0, 50));
        setUnread(unique.filter((n) => !n.read).length);
      } catch (err) {
        // non-fatal: keep defaults
        // console.warn("hydrate notifications failed", err);
      }
    })();

    return () => { mounted = false; };
  }, [scope]);

  // SSE stream: setup/teardown on (scope, reconnectTick)
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const url = `${getSSEUrl()}?token=${encodeURIComponent(token)}`;
    let es;
    try {
      es = new EventSource(url, { withCredentials: false });
      esRef.current = es;
    } catch (err) {
      // EventSource constructor failed (e.g., server URL invalid)
      setConnected(false);
      return;
    }

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
          if (payload.kind === "admin_board") return;
        }

        const normalized = normalizeItem(payload, { scope });
        setItems((prev) => dedupePrepend(prev, normalized, 50));
        if (!pausedRef.current) setUnread((u) => u + 1);

        // Call optional user-provided callback
        try { if (typeof onEvent === "function") onEvent(payload); } catch (e) { /* no-op */ }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setConnected(false);
      try { es.close(); } catch {}
      // schedule a reconnect by bumping reconnectTick
      setTimeout(() => setReconnectTick((t) => t + 1), 1000 + Math.min(30000, reconnectTick * 1000));
    };

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      try { es.close(); } catch {}
      esRef.current = null;
    };
    // NOTE: reconnectTick is intentionally in deps to control backoff reconnects
  }, [scope, reconnectTick, onEvent]);

  // Public helpers
  const markAllRead = useCallback(async () => {
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
  }, []);

  const markOneRead = useCallback(async (id) => {
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
  }, []);

  return { items, unread, connected, markAllRead, markOneRead };
}
