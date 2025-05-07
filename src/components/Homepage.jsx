import { useState } from "react";
import { Filters } from "./Filters";
import { ExperientialWorkshops } from "./ExperientialWorkshops";
import Navbar from "./Navbar";


export default function Homepage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Navbar/>
      {/* Hero Section */}
      <section className="flex-1 bg-green-900 text-white px-6 py-10 md:flex md:items-center md:justify-between">
        {/* Left */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-5xl font-light leading-snug">
            Learn the Art of Organic Skincare with <br />
            <strong className="font-semibold">SIGN NATURAL</strong>
          </h1>
          <p className="text-lg leading-relaxed">
            Discover authentic Ghanaian ingredients and techniques through hands-on workshops,
            online masterclasses, and experiential learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-600 px-6 py-3 rounded text-black font-medium">
              Explore Classes
            </button>
            <button className="bg-white text-black px-6 py-3 rounded border border-white">
              Book an Experience
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="/organic.jpg"
            alt="Organic Products"
            className="rounded-xl w-full max-w-xl mx-auto"
          />
        </div>
      </section>

      {/* Educational Offerings */}
      <section className="bg-[#fdf9f9] py-16 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-green-900">Educational Offerings</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mt-2">
            From free tutorials to comprehensive workshops, we offer multiple ways to learn about authentic Ghanaian skincare.
          </p>
        </div>

        {/* Filters */}
        <Filters />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden min-w-3xs">
            <div className="relative">
              <img src="/body.jpg" alt="Course Image" className="w-full h-56 object-cover" />
              <span className="absolute top-3 right-3 bg-white text-xs font-medium px-3 py-1 rounded-full shadow">
                Free Tutorials
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-serif font-semibold text-gray-900">Shea Butter Basics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Learn the fundamentals of raw shea butter and its benefits.
              </p>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
                <span>⏱ 45 mins</span>
                <span>💰 Free</span>
              </div>
              <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden min-w-3xs">
            <div className="relative">
              <img src="/lab.jpg" alt="Course Image" className="w-full h-56 object-cover" />
              <span className="absolute top-3 right-3 bg-white text-xs font-medium px-3 py-1 rounded-full shadow">
                Online
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-serif font-semibold text-gray-900">Shea Butter Basics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Learn the fundamentals of raw shea butter and its benefits.
              </p>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
                <span>⏱ 45 mins</span>
                <span>💰 Free</span>
              </div>
              <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden min-w-3xs">
            <div className="relative">
              <img src="/organic-essense.jpg" alt="Course Image" className="w-full h-56 object-cover" />
              <span className="absolute top-3 right-3 bg-white text-xs font-medium px-3 py-1 rounded-full shadow">
                In-Person
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-serif font-semibold text-gray-900">Shea Butter Basics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Learn the fundamentals of raw shea butter and its benefits.
              </p>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
                <span>⏱ 45 mins</span>
                <span>💰 Free</span>
              </div>
              <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Experiential Workshops */}
      <ExperientialWorkshops />
    </div>
  );
}
