import React from "react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleActionClick = () => {
    // Redirect to signup (or login, if you want to check auth later)
    navigate("/signup");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={course.thumbnailUrl}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{course.description}</p>
        <button
          onClick={handleActionClick}
          className={`w-full py-2 mt-2 rounded text-white ${
            course.type === "free" ? "bg-green-700" : "bg-yellow-600"
          } hover:opacity-90 transition`}
        >
          {course.type === "free" ? "Start Learning" : "Book Now"}
        </button>
      </div>
    </div>
  );
}
