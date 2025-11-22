// src/hooks/useBook.js
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthed } from "../lib/auth";
import { createBooking } from "../api/services/bookings";
import { useCallback, useState } from "react";

/**
 * useBook - lightweight booking helper that preserves existing architecture.
 * - Requires your existing createBooking service.
 * - Returns { bookItem, loading, error } so callers can show UI states.
 */
export default function useBook() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bookItem = useCallback(
    async ({ itemType, itemId, price, scheduledAt } = {}) => {
      // Prevent parallel attempts from the UI
      if (loading) return null;

      // 1) Require login
      if (!isAuthed()) {
        const next = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;
        navigate(next);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        // 2) Call backend (this is your existing service)
        const payload = { itemType, itemId, price };
        if (scheduledAt) payload.scheduledAt = scheduledAt;

        const res = await createBooking(payload);

        // 3) Go to "My Bookings" tab (keeps existing navigation)
        navigate("/user-dashboard?tab=bookings");

        return res;
      } catch (err) {
        // Normalize and preserve error for caller UI
        const msg = err?.response?.data?.message || err?.message || "Booking failed";
        setError(msg);
        // Rethrow so callers who want to handle can catch
        throw err;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, navigate, location.pathname, location.search]
  );

  return { bookItem, loading, error };
}
