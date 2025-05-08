import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [tutorials, setTutorials] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    // Fetch all tutorials and stories from the backend
    axios.get("/api/tutorials").then((res) => {
      const data = res.data;
      setTutorials(Array.isArray(data) ? data : []);
    });

    axios.get("/api/stories").then((res) => {
      const data = res.data;
      setStories(Array.isArray(data) ? data : []);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <a href="#tutorials" className="block hover:text-green-300">Tutorials</a>
          <a href="#stories" className="block hover:text-green-300">Stories</a>
          <a href="#users" className="block hover:text-green-300">Users</a>
          <a href="#settings" className="block hover:text-green-300">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Welcome, Admin</h1>

        {/* Tutorials */}
        <section id="tutorials" className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(tutorials) && tutorials.map((tutorial, index) => (
              <div key={index} className="bg-white rounded shadow p-4">
                <video controls src={tutorial.videoUrl} className="w-full h-48 rounded mb-2" />
                <h3 className="text-green-900 font-medium">{tutorial.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Stories */}
        <section id="stories">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">User-Submitted Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(stories) && stories.map((story, index) => (
              <div key={index} className="bg-white rounded shadow p-4">
                {story.type === "video" ? (
                  <video controls src={story.mediaUrl} className="w-full h-48 rounded mb-2" />
                ) : (
                  <img src={story.mediaUrl} alt={story.title} className="w-full h-48 object-cover rounded mb-2" />
                )}
                <h3 className="text-green-900 font-medium">{story.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
