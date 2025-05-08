import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [tutorials, setTutorials] = useState([]);
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState({
    title: "",
    media: null,
    type: "image", // or "video"
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch tutorials and stories from backend
    axios.get("/api/tutorials").then((res) => setTutorials(res.data));
    axios.get("/api/stories").then((res) => setStories(res.data));
  }, []);

  const handleStoryChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setNewStory((prev) => ({ ...prev, media: files[0] }));
    } else {
      setNewStory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newStory.title);
    formData.append("media", newStory.media);
    formData.append("type", newStory.type);

    setUploading(true);
    try {
      await axios.post("/api/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Story uploaded successfully");
      setNewStory({ title: "", media: null, type: "image" });
      const updated = await axios.get("/api/stories");
      setStories(updated.data);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Welcome to Your Dashboard</h1>

      {/* Tutorials */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Free Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <video controls src={tutorial.videoUrl} className="w-full h-48 rounded mb-2" />
              <h3 className="font-medium text-green-900">{tutorial.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Upload Story */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Share Your Story</h2>
        <form onSubmit={handleStorySubmit} className="bg-white p-4 rounded shadow space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Story Title"
            value={newStory.title}
            onChange={handleStoryChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            name="type"
            value={newStory.type}
            onChange={handleStoryChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input
            type="file"
            name="media"
            accept={newStory.type === "video" ? "video/*" : "image/*"}
            onChange={handleStoryChange}
            className="w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit Story"}
          </button>
        </form>
      </section>

      {/* Display Stories */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              {story.type === "video" ? (
                <video controls src={story.mediaUrl} className="w-full h-48 rounded mb-2" />
              ) : (
                <img src={story.mediaUrl} alt={story.title} className="w-full h-48 object-cover rounded mb-2" />
              )}
              <h3 className="font-medium text-green-900">{story.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
