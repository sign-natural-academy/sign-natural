import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../CourseCard";
import Filters from "../Filters";
import Navbar from "../Navbar";
import { Footer } from "../Footer";
import { motion } from "framer-motion";

export default function LearnPage() {
  const dummyCourses = [
    {
      id: 1,
      title: "Glow-Up Skin Routine",
      description: "Learn how to build a simple and effective skincare routine.",
      type: "free",
      image: "/images/soap2.jpg",
      price:"Free",
      duration:"30 mins",
    },
    {
        id: 1,
        title: "Glow-Up Skin Routine",
        description: "Learn how to build a simple and effective skincare routine.",
        type: "free",
        image: "/images/soap3.jpg",
        price:"Free",
        duration:"30 mins",
      },
      {
        id: 1,
        title: "Glow-Up Skin Routine",
        description: "Learn how to build a simple and effective skincare routine.",
        type: "free",
        image: "/images/soap4.jpg",
        price:"Free",
        duration:"30 mins",
      },
    {
      id: 2,
      title: "Online Skincare Masterclass",
      description: "Join our virtual masterclass with a certified dermatologist.",
      type: "online",
      image: "/images/soap5.jpg",
      price:"₵200",
      duration:"45 mins",
    },
    {
        id: 2,
        title: "Online Skincare Masterclass",
        description: "Join our virtual masterclass with a certified dermatologist.",
        type: "online",
        image: "/images/soap6.jpg",
        price:"₵250",
        duration:"60 mins",
      },
      {
        id: 2,
        title: "Online Skincare Masterclass",
        description: "Join our virtual masterclass with a certified dermatologist.",
        type: "online",
        image: "/images/soap1.jpg",
        price:"₵500",
        duration:"120 mins",
      },
    {
      id: 3,
      title: "In-Person Skin Consultation",
      description: "Get hands-on advice from professionals in your city.",
      type: "in-person",
      image: "/images/skinoil.jpg",
       price:"₵500",
      duration:"120 mins",
    },
    {
        id: 3,
        title: "In-Person Skin Consultation",
        description: "Get hands-on advice from professionals in your city.",
        type: "in-person",
        image: "/images/cream1.jpg",
        price:"₵500",
        duration:"120 mins",
      },
      {
        id: 3,
        title: "In-Person Skin Consultation",
        description: "Get hands-on advice from professionals in your city.",
        type: "in-person",
        image: "/images/oil.jpg",
        price:"₵500",
        duration:"120 mins",
      },
    {
      id: 4,
      title: "On-Demand Acne Treatment Guide",
      description: "Watch anytime and learn how to deal with persistent acne.",
      type: "in-demand",
      image: "/images/oil2.jpg",
      price:"₵500",
      duration:"120 mins",
    },
    {
        id: 4,
        title: "On-Demand Acne Treatment Guide",
        description: "Watch anytime and learn how to deal with persistent acne.",
        type: "in-demand",
        image: "/images/body.jpg",
        price:"₵500",
        duration:"120 mins",
      },
      {
        id: 4,
        title: "On-Demand Acne Treatment Guide",
        description: "Watch anytime and learn how to deal with persistent acne.",
        type: "in-demand",
        image: "/images/organicskin.jpg",
        price:"₵500",
        duration:"120 mins",
      },
  ];

  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(""); // Replace with actual API
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses(dummyCourses); // Use dummy data as fallback
      }
    };

    fetchCourses();
  }, []);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredCourses = Array.isArray(courses)
    ? courses.filter((course) =>
        filter === "all" ? true : course.type === filter
      )
    : [];

  return (
    <div>
        <Navbar/>

        <div className="bg-gradient-to-r from-[#fdf6ee] to-[#fcf9f4] py-12 text-center px-4">
  <motion.h2 
  initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">
    Skincare School
  </motion.h2>
  <motion.p 
  initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg">
    From free tutorials to comprehensive workshops, we offer multiple ways to learn
    about authentic Ghanaian skincare. Choose the learning method that works best for you.
  </motion.p>
</div>

    <div className="p-4 max-w-screen-lg mx-auto">
      


      {/* Filter bar */}
      <Filters currentFilter={filter} onFilterChange={handleFilterChange} />

      {/* Course cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
    <Footer/>
    </div>
  );
}
