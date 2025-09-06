import React from "react";
import { useNavigate } from "react-router-dom";

export default function WorkshopCard({ workshop }) {
  const navigate = useNavigate();
  const handleActionClick = () => navigate("/signup");

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      <img src={workshop.image} alt={workshop.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{workshop.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{workshop.description}</p>
          <p className="text-sm text-gray-700">Price: {workshop.price || "N/A"}</p>
          <p className="text-sm text-gray-700">Duration: {workshop.duration || "N/A"}</p>
          <p className="text-sm text-gray-700">Location: {workshop.city || "N/A"}</p>
          <p className="text-sm text-gray-700 mb-2">Participants: {workshop.participants || "N/A"}</p>
        </div>
        <button onClick={handleActionClick} className="bg-[#E1AD01] text-black font-medium py-2 mt-4 rounded hover:opacity-90 transition">Book Now</button>
      </div>
    </div>
  );
}
