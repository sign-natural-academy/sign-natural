import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChalkboardTeacher, FaVideo } from "react-icons/fa";
import { Footer } from "../Footer";

export default function UserDashboard() {
  const [freeTutorials, setFreeTutorials] = useState([]);
  const [inPersonCourses, setInPersonCourses] = useState([]);

  useEffect(() => {
    axios.get("/api/tutorials").then((res) => {
      const tutorials = Array.isArray(res.data) ? res.data : [];
      setFreeTutorials(tutorials.filter((t) => t.type === "free"));
    });

    axios.get("/api/inperson-courses").then((res) => {
      const courses = Array.isArray(res.data) ? res.data : [];
      setInPersonCourses(courses);
    });
  }, []);

  return (
    <div>
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-8">Sign Natural Academy</h2>
        <nav className="space-y-4 text-gray-800">
          <a href="#" className="block font-medium">Dashboard</a>
          <a href="#" className="block text-sm text-gray-600">Wishlist</a>
          <a href="#" className="block text-sm text-gray-600">Messages</a>
          <h3 className="mt-6 text-xs text-gray-500 uppercase">Categories</h3>
          <ul className="text-sm mt-2 space-y-1 text-gray-700">
            <li>Free Tutorial </li>
           
          </ul>
        </nav>
       
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800"></h1>
          <div className="flex items-center space-x-4">
            <button>🔍</button>
            <button>🛒</button>
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">My Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {freeTutorials.map((course, index) => (
              <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
                <video controls src={course.videoUrl} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-800 truncate">{course.title}</h3>
                  <p className="text-xs text-gray-500">{course.author}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div className="bg-green-800 h-1 rounded-full" style={{ width: course.progress + "%" }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-700">{course.progress}% Complete</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">In-Person Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {inPersonCourses.map((course, index) => (
              <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
                {course.type === "live" ? (
                  <div className="flex items-center justify-center h-32 bg-green-100 text-green-700">
                    <FaVideo size={32} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 bg-yellow-100 text-yellow-700">
                    <FaChalkboardTeacher size={32} />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-800 truncate">{course.title}</h3>
                  <p className="text-xs text-gray-500">{course.instructor}</p>
                  <p className="text-xs text-gray-500 mt-1">{course.type === "live" ? "Live Session" : "Face-to-Face"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
    <Footer/>
    </div>
  );
}
