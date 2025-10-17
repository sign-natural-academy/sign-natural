//src/components/ui/CustomWorkshopPackage.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CustomWorkshopPackage() {
  return (
    <div className="bg-[#faf8f6] py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#4a2e2a] mb-4">Customized Workshop Packages</h2>
          <p className="text-[#6b4e4b] mb-6 leading-relaxed">We can tailor any of our workshop experiences to meet your specific needs. Whether corporate, bridal, or birthday — we make it special.</p>
          <Link to="/signup"><button className="bg-[#E1AD01] text-black px-6 py-3 rounded-md shadow hover:bg-[#8b685c]">Request Custom Package</button></Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative md:w-1/2">
          <img src="/skincare.jpeg" alt="Custom Workshop" className="rounded-xl w-full h-auto object-cover" />
          <div className="absolute bottom-4 right-4 bg-[#e4d1a0] text-[#4a2e2a] text-lg font-bold px-4 py-1 rounded-full shadow-md">100%<br/>Custom</div>
        </motion.div>
      </div>
    </div>
  );
}
