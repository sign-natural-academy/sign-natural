import {
    Squares2X2Icon,
    BookOpenIcon,
    VideoCameraIcon,
    UserGroupIcon,
    ClockIcon,
  } from "@heroicons/react/24/outline";
  
  export function Filters() {
    return (
      <div className="flex flex-wrap justify-center mb-8 gap-2 bg-[#f6f6f6] p-2 rounded-full max-w-fit mx-auto">
      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#472B2B] mb-2 text-white text-xs sm:text-sm font-medium cursor-pointer">
        <Squares2X2Icon className="w-3 h-3 sm:w-4 sm:h-4" /> All Classes
      </span>
      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-100 cursor-pointer">
        <BookOpenIcon className="w-3 h-3 sm:w-4 sm:h-4" /> Free Tutorials
      </span>
      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-100 cursor-pointer">
        <VideoCameraIcon className="w-3 h-3 sm:w-4 sm:h-4" /> Online
      </span>
      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-100 cursor-pointer">
        <UserGroupIcon className="w-3 h-3 sm:w-4 sm:h-4" /> In-Person
      </span>
      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-100 cursor-pointer">
        <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" /> On-Demand
      </span>
    </div>
    
    );
  }
  