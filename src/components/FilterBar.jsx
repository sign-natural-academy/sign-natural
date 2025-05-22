import React from "react";
import { motion } from "framer-motion";

const filters = [
  { key: "all", label: "All Stories" },
  { key: "classes", label: "Classes & Courses" },
  { key: "workshop", label: "Workshops" },
  { key: "products", label: "Products" },
];

// FilterBar.jsx
export default function FilterBar({ currentFilter, onFilterChange }) {
  return (
    <>
    <motion.div 
    initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
    className="flex flex-wrap justify-center mb-8 gap-2 bg-[#f6f6f6] p-2 rounded-full max-w-fit mx-auto">
      {filters.map(({ key, label }) => (
        <span
          key={key}
          onClick={() => onFilterChange(key)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium cursor-pointer ${
            currentFilter === key
              ? "bg-[#472B2B] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {label}
        </span>
      ))}
    </motion.div>
    </>
  );
}

