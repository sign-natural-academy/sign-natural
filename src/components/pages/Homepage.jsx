import React from "react";
import ExperientialWorkshops from "../ui/ExperientialWorkshops";
import CustomWorkshopPackage from "../ui/CustomWorkshopPackage";
import ProductsToLearning from "../ui/ProductToLearning";
import SuccessPreview from "../ui/SuccessPreview";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function Homepage() {
  return (
    
    <div className="w-full min-h-screen flex flex-col bg-white pt-24">
      <Navbar/>
      <section className="flex-1 bg-[#455f30] text-white pt-12 px-6 md:flex md:items-center md:justify-between transition">
        <div className="md:w-1/2 space-y-6 py-8">
          <h1 className="text-3xl md:text-5xl font-light leading-snug">
            Learn the Art of Organic Skincare with <br />
            <strong className="font-semibold">SIGN NATURAL</strong>
          </h1>
          <p className="text-lg leading-relaxed">
            Discover authentic Ghanaian ingredients and techniques through hands-on workshops, online masterclasses, and experiential learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/learn" className="bg-[#E1AD01] px-6 py-3 rounded text-black font-medium">Explore Classes</a>
            <a href="/signup" className="bg-white text-black px-6 py-3 rounded border border-white">Book an Experience</a>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 p-8">
          <img src="/organic.jpg" alt="Organic products" className="rounded-xl w-full max-w-xl mx-auto" />
        </div>
      </section>

      <section className="bg-[#faf8f6] py-16 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#472B2B] mb-2">Educational Offerings</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mt-2">From free tutorials to masterclasses — pick what suits you.</p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3 px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold">Free Tutorials</h3>
            <p className="text-sm text-gray-600 mt-2">Short videos to help you start with basics.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold">Online Masterclasses</h3>
            <p className="text-sm text-gray-600 mt-2">Live sessions with experts.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold">In-person Workshops</h3>
            <p className="text-sm text-gray-600 mt-2">Hands-on sessions in Accra and beyond.</p>
          </div>
        </div>
      </section>

      <ExperientialWorkshops />
      <CustomWorkshopPackage />
      <ProductsToLearning />
      <SuccessPreview />
      <Footer/>
    </div>
  );
}
