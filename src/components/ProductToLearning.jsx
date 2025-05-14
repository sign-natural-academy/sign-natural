import React from "react";

const products = [
  {
    name: "Shea Body Butter",
    description: "Rich, creamy body butter made with raw Ghanaian shea butter and essential oils.",
    price: "GH 45.99",
    workshop: "Body Butter Creation",
    image: "/soap.jpg", // Replace with actual image path
  },
  {
    name: "Cocoa Facial Mask",
    description: "Rejuvenating facial mask with pure Ghanaian cocoa and clay for glowing skin.",
    price: "GH 40.99",
    workshop: "Natural Facial Masks Masterclass",
    image: "/body-2.jpg",
  },
  {
    name: "Baobab Hair Oil",
    description: "Nourishing hair oil blend with baobab oil for stronger, healthier hair.",
    price: "GH 39.99",
    workshop: "Natural Haircare Workshop",
    image: "/boabab.jpg",
  },
];

export default function ProductsToLearning() {
  return (
    <section className="py-12 px-4 text-center bg-[#FCD28A]">
      <h2 className="text-3xl font-bold text-[#472B2B] mb-2">From Products to Learning</h2>
      <p className="text-[#6b4c4c] mb-10">
        Love our products? Learn how to make your own version in our specialized workshops.
      </p>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map((product, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 relative text-left">
            <img src={product.image} alt={product.name} className="rounded-t-md h-48 w-full object-cover" />
            <span className="absolute top-4 right-4 bg-[#d6b88f] text-white font-semibold px-3 py-1 rounded">
              {product.price}
            </span>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-700 mt-1">{product.description}</p>

              <div className="bg-[#f5efe7] p-3 rounded mt-4">
                <p className="text-xs text-gray-600 mb-1">Related Workshop:</p>
                <p className="font-semibold">{product.workshop}</p>
                <button className="bg-white text-gray px-4 py-2 rounded mt-2 hover:bg-[#E1AD01] transition">
                  Make Your Own Version
                </button>
              </div>

              <button className="w-full mt-4 border border-gray-400 py-2 rounded hover:bg-gray-100 transition">
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
