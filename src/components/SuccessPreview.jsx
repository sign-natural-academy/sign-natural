import React, { useEffect, useState } from "react";
import StoryGrid from "./StoryGrid";
import ShareExperienceView from "./shareExperienceView";
import { useNavigate } from "react-router-dom";

const dummyStories = [
  {
    id: 1,
    name: "Amara Johnson",
    type: "workshop",
    subtitle: "In-Person Workshop",
    image: "/images/cream1.jpg",
    rating: 5,
    text: "The body butter workshop was incredible! I learned so much about natural ingredients...",
    tag: "My Creation",
  },
  {
    id: 2,
    name: "Daniel Mensah",
    type: "classes",
    subtitle: "Diasporan Package",
    image: "/images/soap3.jpg",
    rating: 5,
    text: "As someone visiting from the diaspora, the workshop was a great way to connect...",
    tag: "My Creation",
  },
  {
    id: 3,
    name: "Sophia Addo",
    type: "workshop",
    subtitle: "Group Event",
    image: "/images/oil.jpg",
    rating: 5,
    text: "We booked the group workshop for my sister's bridal shower and it was such a unique experience!",
    tag: "My Creation",
  },
  {
    id: 4,
    name: "Kwame Osei",
    type: "classes",
    subtitle: "Online Masterclass",
    rating: 5,
    text: "The online masterclass on essential oil blending was fantastic. Despite being virtual...",
  },
];

export default function SuccessPreview() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(""); // Replace with real API
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setStories(data.slice(0, 3));
        } else {
          setStories(dummyStories.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching success stories:", error);
        setStories(dummyStories.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <section className="bg-[#faf8f6*] py-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-semibold text-[#4b2e20] mb-2">
          Success Stories
        </h2>
        <p className="text-gray-700 text-base sm:text-lg max-w-xl mx-auto">
          Hear from our community about their experiences with our workshops, classes, and products.
        </p>
      </div>

      <div className="max-w-6xl mx-auto min-h-[100px]">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin h-6 w-6 border-4 border-brown-300 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <StoryGrid stories={stories} />
        )}
      </div>

      {/* Read More Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/stories")}
          className="px-5 py-2 bg-[#4b2e20] text-white text-sm rounded-full shadow hover:bg-[#6d3a2d] transition duration-200"
        >
          Read More Stories
        </button>
      </div>

      <div className="mt-12">
        <ShareExperienceView />
      </div>
    </section>
  );
}
