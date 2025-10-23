// src/lib/bookNow.js
import { createBooking } from "../api/services/bookings";

export async function bookNowOrRedirect({ itemType, item, navigate, isLoggedIn }) {
  if (!isLoggedIn()) {
    navigate("/login", { replace: true, state: { next: "/user-dashboard?tab=My%20Bookings" } });
    return;
  }
  try {
    await createBooking({
      itemType,
      itemId: item._id,
      price: item.price ?? 0,
    });
    alert("✅ Booking created!");
    navigate("/user-dashboard?tab=My%20Bookings");
  } catch (err) {
    alert(err?.response?.data?.message || "Failed to create booking.");
  }
}
