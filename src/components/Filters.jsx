import {
    Squares2X2Icon,
    BookOpenIcon,
    VideoCameraIcon,
    UserGroupIcon,
    ClockIcon,
  } from "@heroicons/react/24/outline";
  
  export function Filters() {
    return (
      <div className="flex justify-center mb-8 space-x-2 bg-[#f6f6f6] p-2 rounded-full max-w-fit mx-auto">
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-lime-700 text-white text-sm font-medium cursor-pointer">
          <Squares2X2Icon className="w-4 h-4" /> All Classes
        </span>
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 text-sm font-medium hover:bg-gray-100 cursor-pointer">
          <BookOpenIcon className="w-4 h-4" /> Free Tutorials
        </span>
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 text-sm font-medium hover:bg-gray-100 cursor-pointer">
          <VideoCameraIcon className="w-4 h-4" /> Online
        </span>
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 text-sm font-medium hover:bg-gray-100 cursor-pointer">
          <UserGroupIcon className="w-4 h-4" /> In-Person
        </span>
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 text-sm font-medium hover:bg-gray-100 cursor-pointer">
          <ClockIcon className="w-4 h-4" /> On-Demand
        </span>
      </div>
    );
  }
  