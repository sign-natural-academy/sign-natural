// src/components/ui/CourseCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useBook from "../../hooks/useBook";

// tiny spinner
function Spinner() {
  return (
    <svg className="w-4 h-4 inline-block animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function CourseCard({ course, onView }) {
  const navigate = useNavigate();
  const { bookItem, loading, error } = useBook();

  const handleActionClick = () => navigate("/signup");

  const handleBook = async () => {
    try {
      await bookItem({ itemType: "Course", itemId: course._id, price: course.price });
      // success navigates inside hook
    } catch (err) {
      // hook already sets error; optionally show extra UI (we keep it minimal)
      // console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
    >
      <button
        type="button"
        onClick={() => onView?.(course._id)}
        className="text-left"
        aria-label={`View details for ${course.title}`}
      >
        <img src={course.image || "/images/soap2.jpg"} alt={course.title} className="w-full h-48 object-cover" />
      </button>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{course.title}</h3>
              {/* LOCATION (new) */}
              {course.location && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  <span className="font-medium">Location:</span> {course.location}
                </div>
              )}
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 shrink-0">
              {course.type || "free"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{course.description}</p>
          <p className="text-sm text-gray-700">Price: {course.price > 0 ? `₵${course.price}` : "Free"}</p>
          {course.duration && <p className="text-sm text-gray-700 mb-2">Duration: {course.duration}</p>}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => onView?.(course._id)}
            className="w-full border border-gray-300 py-2 rounded text-sm hover:bg-gray-50"
          >
            View Details
          </button>

          <button
            onClick={handleBook}
            disabled={loading}
            className={`w-full py-2 rounded text-white font-medium ${course.type === "free" ? "bg-[#455f30]" : "bg-yellow-600"} ${loading ? "opacity-70 pointer-events-none" : ""}`}
          >
            {loading ? <><Spinner /> <span className="ml-2">Booking…</span></> : (course.type === "free" ? "Start Learning" : "Book Now")}
          </button>
        </div>

        {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
      </div>
    </motion.div>
  );
}
