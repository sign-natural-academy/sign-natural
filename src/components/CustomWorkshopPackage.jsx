import React from "react";

export default function CustomWorkshopPackage() {
  return (
    <div className="bg-[#faf8f6*] py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
        {/* Text Content */}
        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#4a2e2a] mb-4">
            Customized Workshop Packages
          </h2>
          <p className="text-[#6b4e4b] mb-6 leading-relaxed">
            We can tailor any of our workshop experiences to meet your specific
            needs. Whether you're looking for a unique corporate retreat
            activity, a fun bridal shower experience, or a memorable birthday
            celebration, we'll work with you to create the perfect package.
          </p>
          <button className="bg-[#E1AD01] text-black px-6 py-3 rounded-md shadow hover:bg-[#8b685c] transition duration-300">
            Request Custom Package
          </button>
        </div>

        {/* Image Section */}
        <div className="relative md:w-1/2">
          <img
            src="/skincare.jpeg"
            alt="Custom Workshop Sketches"
            className="rounded-xl w-full h-auto object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-[#e4d1a0] text-[#4a2e2a] text-lg font-bold px-4 py-1 rounded-full shadow-md">
            100%<br />Custom
          </div>
        </div>
      </div>
    </div>
  );
}
