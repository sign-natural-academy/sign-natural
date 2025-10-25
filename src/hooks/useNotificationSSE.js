// src/hooks/useNotificationSSE.js
import { useEffect, useRef } from "react";
import { getToken } from "../lib/auth";
import { getMyNotifications } from "../api/services/notifications";

/**
 * Combines initial fetch + real-time SSE pushes.
 * onEvent receives payload from the server (already JSON).
 */
export default function useNotificationSSE({ onEvent, onInitial }) {
  const esRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // initial load for badge + list
        const res = await getMyNotifications();
        if (!cancelled) onInitial?.(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        // silent
      }

      // open SSE
      const token = getToken();
      if (!token) return; // not signed in

      const url = `${import.meta.env.VITE_API_BASE_URL || ""}/api/notifications/stream?token=${encodeURIComponent(token)}`;
      const es = new EventSource(url, { withCredentials: false });
      esRef.current = es;

      es.onmessage = (evt) => {
        if (!evt.data) return;
        try {
          const payload = JSON.parse(evt.data);
          onEvent?.(payload);
        } catch {}
      };

      es.addEventListener('hello', () => {}); // optional

      es.onerror = () => {
        // browser will auto-reconnect; optional custom logic here
      };
    })();

    return () => {
      cancelled = true;
      try { esRef.current?.close(); } catch {}
    };
  }, [onEvent, onInitial]);
}
