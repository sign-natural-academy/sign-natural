// src/hooks/useBook.js
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthed, getUserRole } from "../lib/auth";
import { createBooking } from "../api/services/bookings";
import { useCallback, useState } from "react";

/**
 * useBook
 * - Preserves existing architecture
 * - Requires contact (backend requirement)
 * - Blocks admins
 */
export default function useBook() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bookItem = useCallback(
    async ({ itemType, itemId, price, scheduledAt, contact, attendees = [] } = {}) => {
      if (loading) return null;

      // ❌ Admins cannot book
      if (isAuthed() && getUserRole?.() === "admin") {
        setError("Admins are not allowed to make bookings.");
        return null;
      }

      if (!contact?.name || !contact?.email) {
        setError("Contact name and email are required.");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const payload = {
          itemType,
          itemId,
          price,
          contact,
          attendees,
        };

        if (scheduledAt) payload.scheduledAt = scheduledAt;

        const res = await createBooking(payload);

        if (isAuthed()) {
          navigate("/user-dashboard?tab=bookings");
        }

        return res;
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Booking failed";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loading, navigate, location.pathname, location.search]
  );

  return { bookItem, loading, error };
}
