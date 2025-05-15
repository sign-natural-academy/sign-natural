import React from 'react';

export default function TutorialGrid({ tutorials = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tutorials.map(tut => (
        <div key={tut.id} className="border rounded-lg p-2 shadow-sm">
          <video controls className="w-full h-48 rounded-md object-cover mb-2">
            <source src={tut.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h4 className="font-semibold text-md">{tut.title}</h4>
          <p className="text-sm text-gray-500">{tut.description}</p>
        </div>
      ))}
    </div>
  );
}
