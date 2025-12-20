// src/components/ui/CourseCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { isAuthed } from "../../lib/auth";

export default function CourseCard({ course, onView }) {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    if (course.type === "free" && isAuthed()) {
      navigate(`/user-dashboard?tab=tutorials&id=${course._id}`);
      return;
    }
    onView?.(course._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
    >
      <button onClick={handlePrimaryAction} className="text-left">
        <img
          src={course.image || "/images/soap2.jpg"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      </button>

      <div className="p-4 flex flex-col grow justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-semibold truncate">{course.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
              {course.type || "free"}
            </span>
          </div>

          {course.location && (
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Location:</span> {course.location}
            </p>
          )}

          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {course.description}
          </p>

          <p className="text-sm text-gray-800 mt-2">
            <strong>Price:</strong>{" "}
            {course.price > 0 ? `₵${course.price}` : "Free"}
          </p>

          {course.duration && (
            <p className="text-sm text-gray-700">
              <strong>Duration:</strong> {course.duration}
            </p>
          )}
        </div>

        <button
          onClick={handlePrimaryAction}
          className={`mt-4 w-full py-2 rounded text-white ${
            course.type === "free" ? "bg-[#455f30]" : "bg-yellow-600"
          }`}
        >
          {course.type === "free" ? "Start Learning" : "View & Book"}
        </button>
      </div>
    </motion.div>
  );
}
