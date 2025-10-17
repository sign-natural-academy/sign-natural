//src/components/pages/LearnPage.jsx

import React, { useEffect, useState } from "react";
import CourseCard from "../ui/CourseCard";
import Filters from "../ui/Filters";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function LearnPage() {
  const dummyCourses = [
    { id: 1, title: "Glow-Up Skin Routine", description: "Build a simple skincare routine.", type: "free", image: "/images/soap2.jpg", price: "Free", duration: "30 mins" },
    { id: 2, title: "Online Skincare Masterclass", description: "Virtual masterclass", type: "online", image: "/images/soap5.jpg", price: "₵200", duration: "45 mins" },
    { id: 3, title: "In-Person Skin Consultation", description: "Hands-on advice in your city.", type: "in-person", image: "/images/skinoil.jpg", price: "₵500", duration: "120 mins" },
    { id: 4, title: "On-Demand Acne Treatment Guide", description: "Watch anytime.", type: "in-demand", image: "/images/oil2.jpg", price: "₵500", duration: "120 mins" },
  ];

  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setCourses(dummyCourses);
  }, []);

  const filteredCourses = courses.filter((c) => (filter === "all" ? true : c.type === filter));

  return (
    <>
     <Navbar/>
    <div className="p-4 max-w-screen-lg mx-auto pt-28">
     
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">Skincare School</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">From free tutorials to masterclasses — pick what suits you.</p>
      </div>

      <Filters currentFilter={filter} onFilterChange={setFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
      
    </div>
    <Footer/>
    </>
  );
}
