
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleActionClick = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{course.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{course.description}</p>
          <p className="text-sm text-gray-700">Price: {course.price || "N/A"}</p>
          <p className="text-sm text-gray-700 mb-2">Duration: {course.duration || "N/A"}</p>
        </div>
        <button
          onClick={handleActionClick}
          className={`w-full py-2 mt-4 rounded text-white font-medium ${
            course.type === "free" ? "bg-green-700" : "bg-yellow-600"
          } hover:opacity-90 transition`}
        >
          {course.type === "free" ? "Start Learning" : "Book Now"}
        </button>
      </div>
    </div>
  );
}
