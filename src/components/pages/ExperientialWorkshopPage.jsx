import React, { useEffect, useState } from "react";
import WorkshopFilters from "../WorkshopFilters";
import Navbar from "../Navbar";
import { Footer } from "../Footer";
import WorkshopCard from "./WorkshopCard";
import { motion } from "framer-motion";


export default function ExperientialWorkshopPage (){
     

     const dummyWorkshops = [{
    id: 1,
    title: "Glow-Up Celebration",
    description: "Celebrate with a guided skincare pampering session.",
    type: "celebration",
    image: "/images/birthday2.jpg",
    price: "₵150",
    duration: "30 mins",
    location: "Accra",
    participants: "10 - 20",
  },
  {
    id: 2,
    title: "Glow & Sip Party",
    description: "Fun skincare party with light refreshments.",
    type: "celebration",
    image: "/images/group1.jpg",
    price: "₵200",
    duration: "60 mins",
    location: "Kumasi",
    participants: "15 - 25",
  },
  {
    id: 3,
    title: "Skincare for the Diaspora",
    description: "Learn ski4ncare with cultural relevance and heritage.",
    type: "diasporan",
    image: "/images/group2.jpg",
    price: "₵250",
    duration: "60 mins",
    location: "Online",
    participants: "Unlimited",
  },
  {
    id: 4,
    title: "Diasporan Glow Workshop",
    description: "A virtual skincare journey across cultures.",
    type: "diasporan",
    image: "/images/group2.jpg",
    price: "₵300",
    duration: "90 mins",
    location: "Online",
    participants: "Up to 100",
  },
  {
    id: 5,
    title: "Group Skin Consultation",
    description: "Hands-on skin advice tailored to your group's needs.",
    type: "group",
    image: "/images/oil.jpg",
    price: "₵500",
    duration: "120 mins",
    location: "Accra",
    participants: "8 - 12",
  },
  {
    id: 6,
    title: "Team Glow-Up Experience",
    description: "Skincare bonding session for teams and friends.",
    type: "group",
    image: "/images/oil2.jpg",
    price: "₵450",
    duration: "110 mins",
    location: "Takoradi",
    participants: "10 - 15",
  },
      ];
    
      const [workshops, setWorkshops] = useState([]);
      const [filter, setFilter] = useState("all");
    
      useEffect(() => {
        const fetchWorkshops = async () => {
          try {
            const response = await fetch(""); // Replace with actual API
            const data = await response.json();
            setWorkshops(data);
          } catch (error) {
            console.error("Failed to fetch courses:", error);
            setWorkshops(dummyWorkshops); // Use dummy data as fallback
          }
        };
    
        fetchWorkshops();
      }, []);
    
      const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
      };
//       
    
      const filteredWorkshops = Array.isArray(workshops)
        ? workshops.filter((workshops) =>
            filter === "all" ? true : workshops.type === filter
          )
        : [];
    return <div>
     <Navbar/>
    
            <div className="bg-gradient-to-r from-[#fdf6ee] to-[#fcf9f4] py-12 text-center px-4">
      <motion.h2 
      initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">
       Experiential Workshops
      </motion.h2>
      <motion.p 
      initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
      className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg">
        Turn skincare education into memorable experiences with our specialized workshops. Perfect for celebrations, cultural experiences, and group events.
      </motion.p>
    </div>
    
        <div className="p-4 max-w-screen-lg mx-auto">
          
    
    
          {/* Filter bar */}
          <WorkshopFilters currentFilter={filter} onFilterChange={handleFilterChange} />
    
          {/* workshopCard  */}
          <>
          <motion.div 
           initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshops) => (

            <WorkshopCard key={workshops.id} workshops={workshops}/>
            ))}
          </motion.div>
          </>
        </div>
        <Footer/>
    </div>
}