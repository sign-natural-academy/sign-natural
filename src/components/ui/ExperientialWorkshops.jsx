//src/components/ui/ExperientialWorkshops.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ExperientialWorkshops() {
  return (
    <section className="bg-[#faf8f6] py-16 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-3xl font-bold text-[#472B2B] mb-2">Experiential Workshops</motion.h2>
        <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-10 sm:mb-12">
          Turn skincare education into memorable experiences with our specialized workshop options.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-5">
            <img src="/images/party4.jpg" alt="Birthday & Celebration" className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-serif font-semibold text-gray-900 mt-3">Birthday & Celebration Sessions</h3>
            <p className="text-sm text-gray-700">Create personalized skincare products with custom labels as memorable party activities.</p>
            <Link to="/signup"><button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100">Book This Experience</button></Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <img src="/images/group2.jpg" alt="Diasporan Packages" className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-serif font-semibold text-gray-900 mt-3">Diasporan Packages</h3>
            <p className="text-sm text-gray-700">Take a piece of Ghana home by creating authentic skincare products using traditional ingredients.</p>
            <Link to="/signup"><button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100">Book This Experience</button></Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <img src="/images/party3.jpg" alt="Group Events" className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-serif font-semibold text-gray-900 mt-3">Group Events</h3>
            <p className="text-sm text-gray-700">Corporate wellness, bridal showers and team-building through collaborative creation.</p>
            <Link to="/signup"><button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100">Book This Experience</button></Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
