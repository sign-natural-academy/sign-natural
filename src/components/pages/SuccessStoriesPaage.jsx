import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Footer } from "../Footer";
import FilterBar from "../FilterBar";
import StoryGrid from "../StoryGrid";
import ShareExperience from "../ShareExperience";
import {
  UserGroupIcon,
  
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";







// Dummy fallback success stories
const dummyStories = [
  {
    id: 1,
    name: "Amara Johnson",
    type: "workshop",
    subtitle: "In-Person Workshop",
    image: "/images/soap6.jpg",
    rating: 5,
    text: "The body butter workshop was incredible! I learned so much about natural ingredients...",
    tag: "My Creation",
  },
  {
    id: 2,
    name: "Daniel Mensah",
    type: "classes",
    subtitle: "Diasporan Package",
    image: "/images/cream1.jpg",
    rating: 5,
    text: "As someone visiting from the diaspora, the workshop was a great way to connect...",
    tag: "My Creation",
  },
  {
    id: 3,
    name: "Sophia Addo",
    type: "workshop",
    subtitle: "Group Event",
    image: "/images/skinoil.jpg",
    rating: 5,
    text: "We booked the group workshop for my sister's bridal shower and it was such a unique experience!",
    tag: "My Creation",
  },
  {
    id: 4,
    name: "Kwame Osei",
    type: "classes",
    subtitle: "Online Masterclass",
    image: "/images/skinoil.jpg",
    rating: 5,
    text: "The online masterclass on essential oil blending was fantastic. Despite being virtual...",
    tag: "My Creation"
  },
  {
    id: 5,
    name: "Esi Abban",
    type: "classes",
    subtitle: "On-Demand Course",
    image: "/images/soap1.jpg",
    rating: 5,
    text: "I took the Complete Skincare Formulation Course, and it has completely transformed...",
    tag: "My Creation",
  },
  {
    id: 6,
    name: "James Taylor",
    type: "products",
    subtitle: "Product Review",
    image: "/images/soap2.jpg",
    rating: 5,
    text: "I've been using the Ghana Glow Shea Body Butter for a month now...",
    tag: "Product",
  },
];

export default function SuccessStoriesPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [stories, setStories] = useState(dummyStories);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(""); // replace with your backend route
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setStories(data);
        } else {
          setStories(dummyStories);
        }
      } catch (error) {
        console.error("Failed to fetch success stories:", error);
        setStories(dummyStories);
      }
    };

    fetchStories();
  }, []);

  const filteredStories =
    selectedFilter === "all"
      ? stories
      : stories.filter((story) => story.type === selectedFilter);

  return (
    <div>
      <Navbar />
        <>
      <motion.div
       initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
             className="bg-gradient-to-r pt-40 from-[#fdf6ee] to-[#fcf9f4] py-12 text-center px-4">
        <h2 className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">
          Success Stories
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg">
          Hear from our community about their experiences with our classes,
          workshops, and products.
        </p>
        <button className="mt-4 px-4 py-2 bg-[#7d4c35] text-white rounded-full text-sm">
           <UserGroupIcon className="inline-block w-5 h-5 mr-2" /> Share Your Story
        </button>
      </motion.div>
      </>
      <>
      <motion.div 
       initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="p-4 max-w-screen-lg mx-auto">
       <FilterBar currentFilter={selectedFilter} onFilterChange={setSelectedFilter} />
       <StoryGrid stories={filteredStories} />
      </motion.div>
      </>

      <ShareExperience />
      <Footer />
    </div>
  );
}
