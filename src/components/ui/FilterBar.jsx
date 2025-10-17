//src/components/ui/FilterBar.jsx

import React from "react";

const filters = [
  { key: "all", label: "All Stories" },
  { key: "classes", label: "Classes & Courses" },
  { key: "workshop", label: "Workshops" },
  { key: "products", label: "Products" },
];

export default function FilterBar({ currentFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap justify-center mb-8 gap-2 bg-[#f6f6f6] p-2 rounded-full max-w-fit mx-auto">
      {filters.map(({ key, label }) => (
        <button key={key} onClick={() => onFilterChange(key)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${currentFilter === key ? "bg-[#472B2B] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
