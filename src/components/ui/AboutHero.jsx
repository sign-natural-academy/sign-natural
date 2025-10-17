//src/components/ui/AboutHero.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative w-full bg-green-50 pt-40 py-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-10">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 leading-tight mb-4">Sign Natural Academy</h1>
          <p className="text-lg text-gray-700 mb-6">The learning and experience wing of Sign Natural — a Ghanaian, women-led skincare brand rooted in tradition, sustainability, and community.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1">
          <img src="/images/soap1.jpg" alt="About Sign Natural Academy" className="rounded-2xl shadow-lg w-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
