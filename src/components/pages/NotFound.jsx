// src/pages/NotFound.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ee] px-4 text-center">
      <h1 className="text-6xl font-bold text-[#4b2e20] mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-[#7d4c35] text-white rounded-full hover:bg-[#5e3628]"
      >
        Go Back Home
      </button>
    </div>
  );
}
