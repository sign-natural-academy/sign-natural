import React from "react";
import {
  UserGroupIcon,
  GifIcon,
  GlobeAsiaAustraliaIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function WorkshopFilters({ currentFilter, onFilterChange }) {
  const filters = [
    { label: "All workshops", value: "all", icon: Squares2X2Icon },
    { label: "Celebrations", value: "celebration", icon: GifIcon },
    { label: "Diasporan", value: "diasporan", icon: GlobeAsiaAustraliaIcon },
    { label: "Group Events", value: "group", icon: UserGroupIcon },
  ];

  return (
    <div className="flex flex-wrap justify-center mb-8 gap-2 bg-[#f6f6f6] p-2 rounded-full max-w-fit mx-auto">
      {filters.map(({ label, value, icon: Icon }) => (
        <button key={value} onClick={() => onFilterChange(value)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${currentFilter === value ? "bg-[#472B2B] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
