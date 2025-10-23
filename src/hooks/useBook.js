import { useNavigate, useLocation } from "react-router-dom";
import { isAuthed } from "../lib/auth";
import { createBooking } from "../api/services/bookings";

export default function useBook() {
  const navigate = useNavigate();
  const location = useLocation();

  async function bookItem({ itemType, itemId, price, scheduledAt }) {
    // 1) Require login
    if (!isAuthed()) {
      const next = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      navigate(next);
      return;
    }

    // 2) Call backend
    const payload = { itemType, itemId, price };
    if (scheduledAt) payload.scheduledAt = scheduledAt;

    await createBooking(payload);

    // 3) Go to "My Bookings" tab
    navigate("/user-dashboard?tab=bookings");
  }

  return { bookItem };
}
