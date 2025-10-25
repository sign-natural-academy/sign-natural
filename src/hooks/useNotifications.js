// src/hooks/useNotifications.js
import { useCallback, useMemo, useState } from "react";
import useNotificationSSE from "./useNotificationSSE";

/**
 * Minimal in-memory notifications store. If you want persistence, also mirror to localStorage.
 *
 * payload shape expected from SSE:
 * { type: string, data?: any, at?: ISOString }
 */
export default function useNotifications({ scope = "user" } = {}) {
  const [items, setItems] = useState([]); // { id, title, body, at, read, kind }
  const [unread, setUnread] = useState(0);

  const add = useCallback((notif) => {
    setItems((prev) => {
      const next = [{ ...notif, id: crypto.randomUUID(), read: false }, ...prev].slice(0, 50);
      return next;
    });
    setUnread((n) => n + 1);
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }, []);

  // Map incoming SSE events to concise notifications.
  const onEvent = useCallback((payload) => {
    const t = payload?.type;
    const at = payload?.at || new Date().toISOString();

    // ---- Admin events
    if (scope === "admin") {
      if (t === "testimonial_pending_created") {
        add({
          kind: "story",
          title: "New pending story",
          body: "A user submitted a testimonial awaiting approval.",
          at,
        });
      }
      if (t === "booking_created") {
        const who = payload?.data?.user?.name || payload?.data?.user?.email || "A user";
        add({
          kind: "booking",
          title: "New booking",
          body: `${who} just booked a ${payload?.data?.itemType?.toLowerCase() || "class"}.`,
          at,
        });
      }
      if (t === "booking_updated") {
        add({
          kind: "booking",
          title: "Booking status updated",
          body: `A booking status changed to ${payload?.data?.status}.`,
          at,
        });
      }
      if (t === "testimonial_deleted" || t === "testimonial_approved") {
        // less relevant to admin but can include if desired
        add({
          kind: "story",
          title: t === "testimonial_approved" ? "Story approved" : "Story deleted",
          body: "A testimonial was moderated.",
          at,
        });
      }
    }

    // ---- User events
    if (scope === "user") {
      if (t === "booking_updated") {
        add({
          kind: "booking",
          title: "Booking updated",
          body: `Your booking was updated to ${payload?.data?.status}.`,
          at,
        });
      }
      if (t === "testimonial_approved") {
        add({
          kind: "story",
          title: "Story approved",
          body: "Your story was approved and is now public.",
          at,
        });
      }
      if (t === "testimonial_rejected") {
        add({
          kind: "story",
          title: "Story rejected",
          body: "Your story was not approved.",
          at,
        });
      }
    }
  }, [add, scope]);

  // Subscribe to SSE once; all mapping above funnels into add()
  useNotificationSSE({ onEvent });

  const api = useMemo(() => ({ items, unread, add, markAllRead }), [items, unread, add, markAllRead]);
  return api;
}
