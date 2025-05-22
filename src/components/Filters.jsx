import {
  Squares2X2Icon,
  BookOpenIcon,
  VideoCameraIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function Filters({ currentFilter, onFilterChange }) {
  const filters = [
    { label: "All Classes", value: "all", icon: Squares2X2Icon },
    { label: "Free Tutorials", value: "free", icon: BookOpenIcon },
    { label: "Online", value: "online", icon: VideoCameraIcon },
    { label: "In-Person", value: "in-person", icon: UserGroupIcon },
    { label: "On-Demand", value: "in-demand", icon: ClockIcon },
  ];

  return (
    <motion.div 
    initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center mb-8 gap-2 bg-[#f6f6f6] p-2 rounded-full max-w-fit mx-auto">
      {filters.map(({ label, value, icon: Icon }) => (
        <span
          key={value}
          onClick={() => onFilterChange(value)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium cursor-pointer ${
            currentFilter === value
              ? "bg-[#472B2B] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
          {label}
        </span>
      ))}
    </motion.div>
  );
}
