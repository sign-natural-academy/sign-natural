// src/components/pages/ExperientialWorkshopPage.jsx

import React, { useEffect, useMemo, useState } from "react";
import WorkshopFilters from "../ui/WorkshopFilters";
import WorkshopCard from "../ui/WorkshopCard";
import { motion } from "framer-motion";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

const dummyWorkshops = [
  { id: 11, title: "Glow-Up Celebration", description: "Celebrate with a guided skincare session.", category: "celebration", mode: "in-person", image: "/images/birthday2.jpg", price: "₵150", duration: "30 mins", city: "Accra", participants: "10 - 20" },
  { id: 12, title: "Glow & Sip Party", description: "Fun skincare party.", category: "celebration", mode: "in-person", image: "/images/group1.jpg", price: "₵200", duration: "60 mins", city: "Kumasi", participants: "15 - 25" },
  { id: 13, title: "Skincare for the Diaspora", description: "Learn skincare with cultural relevance.", category: "diasporan", mode: "online", image: "/images/group2.jpg", price: "₵250", duration: "60 mins", city: "Online", participants: "Unlimited" },
  { id: 14, title: "Group Skin Consultation", description: "Hands-on skin advice.", category: "group", mode: "in-person", image: "/images/oil.jpg", price: "₵500", duration: "120 mins", city: "Accra", participants: "8 - 12" },
];

export default function ExperientialWorkshopPage() {
  const [workshops, setWorkshops] = useState([]);
  const [filters, setFilters] = useState({ category: "all" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWorkshops(dummyWorkshops);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    return workshops.filter((w) => (filters.category === "all" ? true : w.category === filters.category));
  }, [workshops, filters]);

  return (
    <>
    <Navbar/>
    <div className="pt-28">
      <div className="bg-gradient-to-r from-[#faf8f6] to-white py-12 text-center px-4">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">Experiential Workshops</motion.h2>
        <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-gray-700 max-w-2xl mx-auto">Turn skincare education into memorable experiences with our specialized workshops.</motion.p>
      </div>

      <div className="p-4 max-w-screen-lg mx-auto">
        <WorkshopFilters currentFilter={filters.category} onFilterChange={(val) => setFilters((p) => ({ ...p, category: val }))} />

        {loading ? <div className="py-12 text-center">Loading workshops…</div> :
          filtered.length === 0 ? <div className="py-12 text-center">No workshops found.</div> :
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((w) => <WorkshopCard key={w.id} workshop={w} />)}
            </div>
        }
      </div>
    </div>
    <Footer/>
    </>
  );
}
