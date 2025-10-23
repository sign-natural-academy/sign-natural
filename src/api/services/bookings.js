// src/api/services/bookings.js
import api from "../../lib/api";
import { getToken } from "../../lib/auth";

// user: create booking (used from modals)
export const createBooking = (payload) =>
  api.post("/api/bookings", payload, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

// user: my bookings
export const getMyBookings = () =>
  api.get("/api/bookings/me", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

// admin: list all bookings
export const getAllBookings = () =>
  api.get("/api/bookings", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

// admin: update status
export const updateBookingStatus = (id, status) =>
  api.put(
    `/api/bookings/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
