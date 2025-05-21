import { UserGroupIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

export default function ShareExperienceView() {
  return (
    <div className="bg-[#faf8f6*] py-10 px-4">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow p-6 max-w-6xl mx-auto">
        <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6 text-center md:text-left">
          <h3 className="text-2xl font-semibold text-[#4b2e20] mb-2">
            Share Your Experience
          </h3>
          <p className="text-sm text-gray-600">
            Have you attended one of our workshops, taken a class, or used our
            products? We’d love to hear about your experience! Your story could
            inspire others on their natural skincare journey.
          </p>
          <Link to="/signup">
          <button className="mt-4 px-4 py-2 bg-[#7d4c35] text-white rounded-xl text-sm">
            <UserGroupIcon className="inline-block w-5 h-5 mr-2" />
            Share Your Story
          </button>
          </Link>
        </div>
        <div className="md:w-1/2">
          <img
            src="/images/group1.jpg"
            alt="Share experience"
            className="rounded-lg w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
