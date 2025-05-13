import { useNavigate } from "react-router-dom";

export default function WorkshopCard({ workshops }) {
  const navigate = useNavigate();

  const handleActionClick = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      <img
        src={workshops.image}
        alt={workshops.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{workshops.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{workshops.description}</p>
          <p className="text-sm text-gray-700">Price: {workshops.price || "N/A"}</p>
          <p className="text-sm text-gray-700">Duration: {workshops.duration || "N/A"}</p>
          <p className="text-sm text-gray-700">Location: {workshops.location || "N/A"}</p>
          <p className="text-sm text-gray-700 mb-2">Participants: {workshops.participants || "N/A"}</p>
        </div>
        <button
          onClick={handleActionClick}
          className="bg-yellow-600 text-white font-medium py-2 mt-4 rounded hover:opacity-90 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
