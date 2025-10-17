//src/components/ui/ShareExperience.jsx
import React from "react";
import { Link } from "react-router-dom";
import { UserGroupIcon } from "@heroicons/react/24/outline";

export default function ShareExperience() {
  return (
    <div className="bg-[#faf8f6] py-10 px-4">
      <div className="mt-12 text-center bg-white rounded-lg shadow p-6 max-w-5xl mx-auto">
        <h3 className="text-2xl font-semibold text-[#4b2e20] mb-2">Share Your Experience</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">Have you attended one of our workshops, taken a class, or used our products? We’d love to hear about your experience!</p>
        <Link to="/signup"><button className="mt-4 px-4 py-2 bg-[#7d4c35] text-white rounded-xl text-sm"><UserGroupIcon className="inline-block w-5 h-5 mr-2" /> Share Your Story</button></Link>
      </div>
    </div>
  );
}
