import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function WorkshopCard({ workshop, onView }) {
  const navigate = useNavigate();
  const handleActionClick = () => navigate("/signup");

  const imgSrc = workshop.image || "/images/placeholder.jpg";
  const priceText =
    typeof workshop.price === "number" && workshop.price > 0
      ? `₵${workshop.price}`
      : "Free";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
    >
      {/* Clickable image -> opens details (no visible label) */}
      <button
        type="button"
        onClick={() => onView?.(workshop._id)}
        className="text-left"
        aria-label={`View details for ${workshop.title}`}
      >
        <img
          src={imgSrc}
          alt={workshop.title}
          className="w-full h-48 object-cover"
        />
      </button>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {workshop.title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 shrink-0">
              {workshop.type || "group"}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {workshop.description}
          </p>

          <p className="text-sm text-gray-700">Price: {priceText}</p>
          {workshop.duration && (
            <p className="text-sm text-gray-700">Duration: {workshop.duration}</p>
          )}
          <p className="text-sm text-gray-700">
            {/* FIX: use .location (lowercase) */}
            Location: {workshop.location || "—"}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4">
          {/* The ONLY visible View Details button */}
          <button
            onClick={() => onView?.(workshop._id)}
            className="w-full border border-gray-300 py-2 rounded text-sm hover:bg-gray-50"
          >
            View Details
          </button>

          <button
            onClick={handleActionClick}
            className="w-full py-2 rounded text-white font-medium bg-yellow-600"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
