//src/components/ui/MissionVision.jsx

import React from "react";

export default function MissionVision() {
  const cards = [
    {
      title: "Our Mission",
      text: "To educate, inspire, and empower through hands-on, culturally rooted skincare experiences.",
    },
    {
      title: "Our Vision",
      text: "To become Africa’s leading natural skincare education hub celebrating indigenous ingredients.",
    },
  ];

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-amber-50 p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-amber-900 mb-2">{c.title}</h3>
            <p className="text-gray-700">{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
