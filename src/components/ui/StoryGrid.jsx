//src/components/ui/StoryGrid.jsx

import React from "react";

export default function StoryGrid({ stories = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <div key={story.id} className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div>
              <h4 className="font-semibold text-sm">{story.name}</h4>
              <p className="text-xs text-gray-500">{story.subtitle}</p>
            </div>
          </div>

          <div className="flex mb-2 text-yellow-500 text-sm">
            {"★".repeat(story.rating || 5)}
          </div>

          <p className="text-sm text-gray-700 mb-2">{story.text}</p>

          {story.image && (
            <div className="relative">
              <img src={story.image} alt="Created Product" className="w-full h-40 object-cover rounded-lg" />
              {story.tag && <span className="absolute bottom-2 right-2 text-xs bg-amber-100 text-[#7d4c35] px-2 py-1 rounded-full">{story.tag}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
