// src/components/ui/CourseDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getCourseById } from "../../api/services/courses";
import { useNavigate } from "react-router-dom";
import useBook from "../../hooks/useBook";
import api, { authHeaders } from "../../lib/api";
import { isAuthed, getUser } from "../../lib/auth";

export default function CourseDetailsModal({ open, onClose, courseId }) {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  // mode-aware booking state
  const [hasSelfBooked, setHasSelfBooked] = useState(false);
  const [hasOthersBooked, setHasOthersBooked] = useState(false);

  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // ORIGINAL UI STATE (unchanged)
  const [bookForOthers, setBookForOthers] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [guestContact, setGuestContact] = useState({ name: "", email: "" });

  const navigate = useNavigate();
  const { bookItem } = useBook();

  /* ---------------- Load course ---------------- */
  useEffect(() => {
    if (!open || !courseId) return;
    let active = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getCourseById(courseId);
        if (active) setCourse(res.data);
      } catch {
        if (active) setError("Failed to load course");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => (active = false);
  }, [open, courseId]);

  /* ---------------- Booking check (FIXED & MODE-AWARE) ---------------- */
  useEffect(() => {
    if (!open || !courseId || !isAuthed()) return;
    let active = true;

    (async () => {
      try {
        const res = await api.get("/api/bookings/me", {
          headers: authHeaders(),
        });

        let self = false;
        let others = false;

        (res.data || []).forEach((b) => {
          const itemId = b.item?._id || b.item;
          if (
            String(itemId) === String(courseId) &&
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
      } catch {
        // silent fail (non-fatal)
      }
    })();

    return () => (active = false);
  }, [open, courseId]);

  /* ---------------- Handle booking ---------------- */
  const handleBook = async () => {
    setBookingError("");

    // free course redirect
    if (course?.type === "free" && isAuthed()) {
      onClose?.();
      navigate(`/user-dashboard?tab=tutorials&id=${course._id}`);
      return;
    }

    // block duplicate bookings by mode
    if (!bookForOthers && hasSelfBooked) {
      setBookingError("You have already booked this course for yourself.");
      return;
    }

    if (bookForOthers && hasOthersBooked) {
      setBookingError("You have already booked this course for others.");
      return;
    }

    // guests cannot book for others
    if (!isAuthed() && bookForOthers) {
      setBookingError("Guests cannot book for others.");
      return;
    }

    // contact (always required)
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

    // attendees validation
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
        itemType: "Course",
        itemId: course._id,
        price: course.price,
        contact,
        attendees: bookForOthers ? attendees : [],
      });
    } catch (e) {
      setBookingError(e?.response?.data?.message || "Booking failed");
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
          <motion.div className="absolute inset-0 bg-black/40" onClick={onClose} />

          <motion.div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Course details</h3>
              <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {!loading && course && (
              <div className="grid md:grid-cols-2">
                <div className="p-5">
                  <img
                    src={course.image || "/images/soap2.jpg"}
                    className="h-60 w-full object-cover rounded"
                    alt={course.title}
                  />
                </div>

                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-sm text-gray-600">{course.description}</p>

                  {/* ORIGINAL UI — only logic adjusted */}
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

                      {isAuthed() && (
                        <button
                          onClick={() => setBookForOthers(true)}
                          className={`px-3 py-1 text-xs border rounded ${
                            bookForOthers && "bg-black text-white"
                          }`}
                        >
                          Others
                        </button>
                      )}
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
                            setGuestContact({ ...guestContact, name: e.target.value })
                          }
                        />
                        <input
                          className="w-full border px-2 py-1 rounded text-xs"
                          placeholder="Your email"
                          value={guestContact.email}
                          onChange={(e) =>
                            setGuestContact({ ...guestContact, email: e.target.value })
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
                      : course.type === "free"
                      ? "Start Learning"
                      : "Book"}
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
