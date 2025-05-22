import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-[#E1AD01] rounded-full animate-bounce delay-0"></div>
        <div className="w-3 h-3 bg-[#E1AD01] rounded-full animate-bounce delay-100"></div>
        <div className="w-3 h-3 bg-[#E1AD01] rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
}
