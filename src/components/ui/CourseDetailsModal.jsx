// src/components/ui/CourseDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getCourseById } from "../../api/services/courses";
import { useNavigate } from "react-router-dom";
import { isAuthed } from "../../lib/auth";
import { bookNowOrRedirect } from "../../lib/bookNow";
import useBook from "../../hooks/useBook";

export default function CourseDetailsModal({ open, onClose, courseId }) {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { bookItem } = useBook();
  const handleBook = () =>
    course &&
    bookItem({ itemType: "Course", itemId: course._id, price: course.price });

  // fetch full course on open/id change
  useEffect(() => {
    let active = true;
    async function load() {
      if (!open || !courseId) return;
      setLoading(true);
      setError("");
      try {
        const res = await getCourseById(courseId);
        if (active) setCourse(res.data);
      } catch (e) {
        if (active)
          setError(e.response?.data?.message || "Failed to load course");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [open, courseId]);

  return (
    <AnimatePresence>
      {open && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Course details</h3>
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {loading && <div className="p-6">Loading…</div>}
            {!loading && error && (
              <div className="p-6 text-red-600">{error}</div>
            )}

            {!loading && !error && course && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-5">
                  <img
                    src={course.image || "/images/soap2.jpg"}
                    alt={course.title}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <div className="text-sm text-gray-500">
                    {course.category ? `${course.category} • ` : ""}
                    {course.type?.toUpperCase()}
                  </div>
                  {course.duration && (
                    <div className="text-sm text-gray-600">
                      ⏱ Duration: {course.duration}
                    </div>
                  )}
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {course.description || "No description provided."}
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      {course.price > 0 ? `₵${course.price}` : "Free"}
                    </div>
                    <div className="flex gap-2">
                      {/* Primary CTA – you can later wire to a booking flow */}
                      <button
                        onClick={() =>
                          bookNowOrRedirect({
                            itemType: "Course",
                            item: course,
                            navigate,
                            isAuthed,
                          })
                        }
                        className="px-4 py-2 rounded bg-[#455f30] text-white text-sm"
                      >
                        <button
                          onClick={handleBook}
                          className="px-4 py-2 rounded bg-[#455f30] text-white text-sm"
                        >
                          {course.type === "free"
                            ? "Start Learning"
                            : "Book / Enroll"}
                        </button>
                      </button>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
