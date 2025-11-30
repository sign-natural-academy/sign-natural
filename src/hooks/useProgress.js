// src/hooks/useProgress.js
import { useCallback, useEffect, useState } from "react";

/**
 * Simple per-item progress stored in localStorage.
 * Key: sn:progress:<id> -> JSON { v: number } where v is 0..1
 *
 * API:
 *  - getProgress(id) -> number (0..1)
 *  - setProgress(id, value) -> void
 *
 * Returns a live React state object to allow components to re-render when progress changes.
 */

const PREFIX = "sn:progress:";

function readRaw(id) {
  try {
    const raw = localStorage.getItem(PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeRaw(id, obj) {
  try {
    localStorage.setItem(PREFIX + id, JSON.stringify(obj));
    // also dispatch a custom event on window so same-tab listeners can respond
    window.dispatchEvent(new CustomEvent("sn:progress:updated", { detail: { id, obj } }));
  } catch {
    // ignore
  }
}

export function getProgress(id) {
  if (!id) return 0;
  const r = readRaw(id);
  if (!r || typeof r.v !== "number") return 0;
  const v = Number(r.v);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function setProgress(id, fraction) {
  if (!id) return;
  let v = Number(fraction) || 0;
  v = Math.max(0, Math.min(1, v));
  writeRaw(id, { v, updatedAt: new Date().toISOString() });
}

/**
 * Hook that exposes a map of progress values for a list of ids and helpers.
 * - ids: array of item ids to watch (optional)
 */
export default function useProgress(ids = []) {
  const [map, setMap] = useState(() => {
    const out = {};
    if (Array.isArray(ids)) {
      ids.forEach((id) => {
        out[id] = getProgress(id);
      });
    }
    return out;
  });

  // Handler to update a single id (storage + custom event)
  const updateFromEvent = useCallback(
    (ev) => {
      const payload = ev?.detail;
      if (payload && payload.id) {
        const id = payload.id;
        const v = payload.obj?.v ?? getProgress(id);
        setMap((m) => ({ ...m, [id]: v }));
      } else {
        // fallback to storage event (other tabs)
        if (ev?.key && ev.key.startsWith(PREFIX)) {
          const id = ev.key.slice(PREFIX.length);
          setMap((m) => ({ ...m, [id]: getProgress(id) }));
        }
      }
    },
    []
  );

  useEffect(() => {
    // keep map in sync if ids change
    setMap((prev) => {
      const out = { ...prev };
      (ids || []).forEach((id) => {
        out[id] = getProgress(id);
      });
      return out;
    });
    // listen for cross-tab storage events and same-tab custom events
    window.addEventListener("storage", updateFromEvent);
    window.addEventListener("sn:progress:updated", updateFromEvent);
    return () => {
      window.removeEventListener("storage", updateFromEvent);
      window.removeEventListener("sn:progress:updated", updateFromEvent);
    };
  }, [ids, updateFromEvent]);

  const get = useCallback((id) => getProgress(id), []);
  const set = useCallback((id, v) => setProgress(id, v), []);

  return { map, get, set };
}
