// src/components/pages/SuccessStoriesPage.jsx

import React, { useEffect, useState } from "react";
import FilterBar from "../ui/FilterBar";
import StoryGrid from "../ui/StoryGrid";
import ShareExperience from "../ui/ShareExperience";
import { motion } from "framer-motion";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

const dummyStories = [
  { id: 1, name: "Amara Johnson", type: "workshop", subtitle: "In-Person Workshop", image: "/images/soap6.jpg", rating: 5, text: "The body butter workshop was incredible!", tag: "My Creation" },
  { id: 2, name: "Daniel Mensah", type: "classes", subtitle: "Diasporan Package", image: "/images/cream1.jpg", rating: 5, text: "Great way to connect.", tag: "My Creation" },
  { id: 3, name: "Sophia Addo", type: "workshop", subtitle: "Group Event", image: "/images/skinoil.jpg", rating: 5, text: "Unique experience!", tag: "My Creation" }
];

export default function SuccessStoriesPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [stories, setStories] = useState(dummyStories);

  useEffect(() => {
    setStories(dummyStories);
  }, []);

  const filteredStories = selectedFilter === "all" ? stories : stories.filter((s) => s.type === selectedFilter);

  return (
    <>
     <Navbar/>
    <div className="pt-28">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="bg-gradient-to-r from-[#faf8f6] to-white py-12 text-center px-4">
        <h2 className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">Success Stories</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">Hear from our community about their experiences with our classes, workshops, and products.</p>
        <button className="mt-4 px-4 py-2 bg-[#7d4c35] text-white rounded-full text-sm">Share Your Story</button>
      </motion.div>

      <div className="p-4 max-w-screen-lg mx-auto">
        <FilterBar currentFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        <StoryGrid stories={filteredStories} />
      </div>

      <ShareExperience />
    </div>
    <Footer/>
    </>
  );
}
