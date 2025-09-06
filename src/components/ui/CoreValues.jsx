import React from "react";

const coreValues = [
  { title: "Authenticity", description: "We honor and preserve traditional knowledge." },
  { title: "Empowerment", description: "We create opportunities for rural women and global visitors." },
  { title: "Craftsmanship", description: "Every product reflects care and creativity." },
  { title: "Sustainability", description: "We use ethical sourcing and eco-conscious methods." },
  { title: "Joyful Learning", description: "We make learning fun, memorable, and hands-on." },
  { title: "Community-Centered", description: "We support livelihoods and strengthen families." },
];

export default function CoreValues() {
  return (
    <section className="bg-amber-50 py-16 px-6 md:px-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-amber-800 mb-2">Our Core Values</h2>
        <p className="text-gray-700">The pillars that guide every experience and product at Sign Natural Academy.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {coreValues.map((value, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">{value.title}</h3>
            <p className="text-sm text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
