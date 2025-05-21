import { useState, useEffect } from "react";
import Filters from "./Filters";
import { ExperientialWorkshops } from "./ExperientialWorkshops";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import CustomWorkshopPackage from "./CustomWorkshopPackage";
import ProductsToLearning from "./ProductToLearning";
import axios from "axios";
import SuccessPreview from "./SuccessPreview";
import { Link } from 'react-router-dom';

export default function Homepage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Replace with your real API URL
    axios.get("")
      .then((res) => {
        const courseData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setCourses(courseData);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      });
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 bg-[#455f30] text-white px-6 py-10 md:flex md:items-center md:justify-between">
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
            <Link to="/learn">
  <button className="bg-[#E1AD01] px-6 py-3 rounded text-black font-medium">
    Explore Classes
  </button>
</Link>      <Link to="/signup">
            <button className="bg-white text-black px-6 py-3 rounded border border-white">
              Book an Experience
            </button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="/organic.jpg"
            alt="Organic Products"
            className="rounded-xl w-full max-w-xl mx-auto"
          />
        </div>
      </section>

      {/* Educational Offerings */}
      <section className="bg-[#faf8f6] py-16 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#472B2B] mb-2">Educational Offerings</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mt-2">
            From free tutorials to comprehensive workshops, we offer multiple ways to learn about authentic Ghanaian skincare.
          </p>
        </div>

        <Filters />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.isArray(courses) && courses.length > 0 ? (
            courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden min-w-3xs">
                <div className="relative">
                  <img src={course.image} alt="Course" className="w-full h-56 object-cover" />
                  <span className="absolute top-3 right-3 bg-white text-xs font-medium px-3 py-1 rounded-full shadow">
                    {course.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-serif font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
                    <span>⏱ {course.duration}</span>
                    <span>💰 {course.price}</span>
                  </div>
                  <Link to="/learn">
                  <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                    Learn More
                  </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Dummy Courses */}
              {/* Free Tutorials Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden min-w-3xs">
                <div className="relative">
                  <img src="/body.jpg" alt="Course" className="w-full h-56 object-cover" />
                  <span className="absolute top-3 right-3 bg-white text-xs font-medium px-3 py-1 rounded-full shadow">
                    Free Tutorials
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-serif font-semibold text-gray-900">Shea Butter Basics</h3>
                  <p className="text-sm text-gray-600 mt-1">Learn the fundamentals of raw shea butter and its benefits.</p>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
                    <span>⏱ 45 mins</span>
                    <span>💰 Free</span>
                  </div>
                  <Link to="/learn">
                  <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                    Learn More
                  </button>
                  </Link>
                </div>
              </div>

              {/* Online Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden min-w-3xs">
                <div className="relative">
                  <img src="/lab.jpg" alt="Course" className="w-full h-56 object-cover" />
                  <span className="absolute top-3 right-3 bg-white text-xs font-medium px-3 py-1 rounded-full shadow">
                    Online
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-serif font-semibold text-gray-900">Soap Making Workshop</h3>
                  <p className="text-sm text-gray-600 mt-1">Master the process of cold-pressed and hot-processed soap.</p>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
                    <span>⏱ 90 mins</span>
                    <span>💰 GHS 50</span>
                  </div>
                  <Link to="/learn">
                  <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                    Learn More
                  </button>
                  </Link>
                </div>
              </div>

              {/* In-Person Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden min-w-3xs">
                <div className="relative">
                  <img src="/organic-essense.jpg" alt="Course" className="w-full h-56 object-cover" />
                  <span className="absolute top-3 right-3 bg-white text-xs font-medium px-3 py-1 rounded-full shadow">
                    In-Person
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-serif font-semibold text-gray-900">Essential Oils Blending</h3>
                  <p className="text-sm text-gray-600 mt-1">Create custom essential oil blends for skincare routines.</p>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
                    <span>⏱ 60 mins</span>
                    <span>💰 GHS 80</span>
                  </div>
                  <Link to="/learn">
                  <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                    Learn More
                  </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <ExperientialWorkshops />
      <CustomWorkshopPackage />
      <ProductsToLearning />
      <SuccessPreview/>
      <Footer />
    </div>
  );
}
