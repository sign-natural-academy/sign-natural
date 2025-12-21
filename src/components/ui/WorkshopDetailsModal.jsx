// src/components/ui/WorkshopDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getWorkshop } from "../../api/services/workshops";
import useBook from "../../hooks/useBook";
import api, { authHeaders } from "../../lib/api";
import { isAuthed, getUser } from "../../lib/auth";

export default function WorkshopDetailsModal({ open, onClose, workshopId }) {
  const [loading, setLoading] = useState(false);
  const [workshop, setWorkshop] = useState(null);
  const [error, setError] = useState("");

  const [hasSelfBooked, setHasSelfBooked] = useState(false);
  const [hasOthersBooked, setHasOthersBooked] = useState(false);

  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [bookForOthers, setBookForOthers] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [guestContact, setGuestContact] = useState({ name: "", email: "" });

  const { bookItem } = useBook();

  /* ---------------- Load workshop ---------------- */
  useEffect(() => {
    let active = true;
    if (!open || !workshopId) return;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getWorkshop(workshopId);
        if (active) setWorkshop(res.data);
      } catch {
        if (active) setError("Failed to load workshop");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, workshopId]);

  /* ---------------- Booking check (FIXED) ---------------- */
  useEffect(() => {
    let active = true;
    if (!open || !workshopId || !isAuthed()) return;

    (async () => {
      try {
        const res = await api.get("/api/bookings/me", {
          headers: authHeaders(),
        });

        let self = false;
        let others = false;

        (res.data || []).forEach((b) => {
          const itemId = b.item && (b.item._id || b.item);
          if (
            String(itemId) === String(workshopId) &&
            b.status !== "cancelled"
          ) {
            if (Array.isArray(b.attendees) && b.attendees.length > 0) {
              others = true;
            } else {
              self = true;
            }
          }
        });

        if (active) {
          setHasSelfBooked(self);
          setHasOthersBooked(others);
        }
      } catch {}
    })();

    return () => {
      active = false;
    };
  }, [open, workshopId]);
 /* ---------------- Handle booking ---------------- */
  const handleBook = async () => {
    setBookingError("");

    if (!bookForOthers && hasSelfBooked) {
      setBookingError("You have already booked this workshop for yourself.");
      return;
    }

    if (bookForOthers && hasOthersBooked) {
      setBookingError("You have already booked this workshop for others.");
      return;
    }

    const contact = isAuthed()
      ? {
          name: getUser()?.name || "Registered User",
          email: getUser()?.email,
        }
      : guestContact;

    if (!contact?.name || !contact?.email) {
      setBookingError("Contact name and email are required.");
      return;
    }

    if (bookForOthers) {
      const invalid =
        attendees.length === 0 || attendees.some((a) => !a.email);
      if (invalid) {
        setBookingError("Please add at least one attendee email.");
        return;
      }
    }

    setBookingInProgress(true);
    try {
      await bookItem({
        itemType: "Workshop",
        itemId: workshop._id,
        price: workshop.price,
        contact,
        attendees: bookForOthers ? attendees : [],
      });
    } catch (e) {
      setBookingError(e?.response?.data?.message || "Failed to create booking");
    } finally {
      setBookingInProgress(false);
    }
  };

  const isBlocked =
    bookingInProgress ||
    (!bookForOthers && hasSelfBooked) ||
    (bookForOthers && hasOthersBooked);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          <motion.div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Workshop details</h3>
              <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {loading && <div className="p-6">Loading…</div>}
            {!loading && error && (
              <div className="p-6 text-red-600">{error}</div>
            )}

            {!loading && workshop && (
              <div className="grid md:grid-cols-2">
                <div className="p-5">
                  <img
                    src={workshop.image || "/images/soap2.jpg"}
                    className="h-60 w-full object-cover rounded"
                    alt={workshop.title}
                  />
                </div>

                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-semibold">{workshop.title}</h2>
                  <p className="text-sm text-gray-600">
                    {workshop.description}
                  </p>

                  {/* ORIGINAL UI — UNCHANGED */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookForOthers(false)}
                        className={`px-3 py-1 text-xs border rounded ${
                          !bookForOthers && "bg-black text-white"
                        }`}
                      >
                        Myself
                      </button>
                      <button
                        onClick={() => setBookForOthers(true)}
                        className={`px-3 py-1 text-xs border rounded ${
                          bookForOthers && "bg-black text-white"
                        }`}
                      >
                        Others
                      </button>
                    </div>

                    {bookForOthers &&
                      attendees.map((a, i) => (
                        <input
                          key={i}
                          className="w-full border px-2 py-1 rounded text-xs"
                          placeholder="Attendee email"
                          value={a.email}
                          onChange={(e) => {
                            const copy = [...attendees];
                            copy[i] = { email: e.target.value };
                            setAttendees(copy);
                          }}
                        />
                      ))}

                    {bookForOthers && (
                      <button
                        onClick={() =>
                          setAttendees([...attendees, { email: "" }])
                        }
                        className="text-xs text-blue-600"
                      >
                        + Add attendee
                      </button>
                    )}

                    {!isAuthed() && (
                      <>
                        <input
                          className="w-full border px-2 py-1 rounded text-xs"
                          placeholder="Your full name"
                          value={guestContact.name}
                          onChange={(e) =>
                            setGuestContact({
                              ...guestContact,
                              name: e.target.value,
                            })
                          }
                        />
                        <input
                          className="w-full border px-2 py-1 rounded text-xs"
                          placeholder="Your email"
                          value={guestContact.email}
                          onChange={(e) =>
                            setGuestContact({
                              ...guestContact,
                              email: e.target.value,
                            })
                          }
                        />
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleBook}
                    disabled={isBlocked}
                    className={`w-full mt-3 py-2 rounded text-white ${
                      isBlocked
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#455f30]"
                    }`}
                  >
                    {bookingInProgress
                      ? "Booking…"
                      : !bookForOthers && hasSelfBooked
                      ? "Already Booked (Myself)"
                      : bookForOthers && hasOthersBooked
                      ? "Already Booked (Others)"
                      : "Book / Enroll"}
                  </button>

                  {bookingError && (
                    <div className="text-sm text-red-600">{bookingError}</div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
