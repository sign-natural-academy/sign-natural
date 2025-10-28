// src/components/ui/ExperientialWorkshops.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getToken } from "../../lib/auth";

export default function ExperientialWorkshops() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getToken());

  // Handles button click dynamically
  const handleBookClick = () => {
    if (isLoggedIn) {
      // ✅ Authenticated users go to the ExperientialWorkshopPage
      navigate("/workshop");
    } else {
      // 🚪 Unauthenticated users go to signup/login
      navigate("/signup");
    }
  };

  const workshops = [
    {
      image: "/images/party4.jpg",
      title: "Birthday & Celebration Sessions",
      text: "Create personalized skincare products with custom labels as memorable party activities.",
    },
    {
      image: "/images/group2.jpg",
      title: "Diasporan Packages",
      text: "Take a piece of Ghana home by creating authentic skincare products using traditional ingredients.",
    },
    {
      image: "/images/party3.jpg",
      title: "Group Events",
      text: "Corporate wellness, bridal showers and team-building through collaborative creation.",
    },
  ];

  return (
    <section className="bg-[#faf8f6] py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-[#472B2B] mb-2"
        >
          Experiential Workshops
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          Turn skincare education into memorable experiences with our specialized workshop options.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {workshops.map((workshop, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
            >
              <img
                src={workshop.image}
                alt={workshop.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-serif font-semibold text-gray-900 mt-3">
                {workshop.title}
              </h3>
              <p className="text-sm text-gray-700">{workshop.text}</p>

              <button
                onClick={handleBookClick}
                className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Book This Experience
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
