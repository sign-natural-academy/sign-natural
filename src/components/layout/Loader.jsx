import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-[#E1AD01] rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-[#E1AD01] rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-[#E1AD01] rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
