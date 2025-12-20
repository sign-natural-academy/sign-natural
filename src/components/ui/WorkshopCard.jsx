// src/components/ui/WorkshopCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function WorkshopCard({ workshop, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
    >
      <button onClick={() => onView(workshop._id)} className="text-left">
        <img
          src={workshop.image || "/images/soap2.jpg"}
          alt={workshop.title}
          className="w-full h-48 object-cover"
        />
      </button>

      <div className="p-4 flex flex-col grow justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-semibold truncate">
              {workshop.title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
              {workshop.type || "workshop"}
            </span>
          </div>

          {workshop.location && (
            <p className="text-xs text-gray-500 mt-1">
              <strong>Location:</strong> {workshop.location}
            </p>
          )}

          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {workshop.description}
          </p>

          <p className="text-sm text-gray-800 mt-2">
            <strong>Price:</strong>{" "}
            {workshop.price > 0 ? `₵${workshop.price}` : "Free"}
          </p>

          {workshop.duration && (
            <p className="text-sm text-gray-700">
              <strong>Duration:</strong> {workshop.duration}
            </p>
          )}
        </div>

        <button
          onClick={() => onView(workshop._id)}
          className="mt-4 w-full py-2 bg-[#455f30] text-white rounded"
        >
          View & Book
        </button>
      </div>
    </motion.div>
  );
}
