// src/components/pages/Homepage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../lib/auth"; // ✅ add import for token check
import ExperientialWorkshops from "../ui/ExperientialWorkshops";
import CustomWorkshopPackage from "../ui/CustomWorkshopPackage";
import ProductsToLearning from "../ui/ProductToLearning";
import SuccessPreview from "../ui/SuccessPreview";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import HomeHeroVideo from "../ui/HomeHeroVideo";

export default function Homepage() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getToken());

  const handleBookExperience = () => {
    if (isLoggedIn) {
      navigate("/learn"); // ✅ redirect authenticated users to LearnPage
    } else {
      navigate("/signup"); // 🚪 redirect unauthenticated users to signup/login
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white pt-24">
      <Navbar />

      <section className="flex-1 bg-[#455f30] text-white pt-12 px-6 md:flex md:items-center md:justify-between transition">
        <div className="md:w-1/2 space-y-6 py-8">
          <h1 className="text-3xl md:text-5xl font-light leading-snug">
            Learn the Art of Natural Skincare with <br />
            <strong className="font-semibold">SIGN NATURAL</strong>
          </h1>
          <p className="text-lg leading-relaxed">
            Discover authentic Ghanaian ingredients and techniques through
            hands-on workshops, online masterclasses, and experiential learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/learn"
              className="bg-[#E1AD01] px-6 py-3 rounded text-black font-medium"
            >
              Explore Classes
            </Link>

            {/* ✅ Conditional redirect on click */}
            <button
              onClick={handleBookExperience}
              className="bg-white text-black px-6 py-3 rounded border border-white hover:bg-gray-100 transition"
            >
              Book an Experience
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 p-8">
          <img
            src="/organic.jpg"
            alt="Organic products"
            className="rounded-xl w-full max-w-xl mx-auto"
          />
        </div>
      </section>
      <HomeHeroVideo/>
      <ExperientialWorkshops />
      <CustomWorkshopPackage />
      <ProductsToLearning />
      <SuccessPreview />
      <Footer />
    </div>
  );
}
