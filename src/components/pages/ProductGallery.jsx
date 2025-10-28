// src/components/pages/ProductGallery.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import { getProducts } from "../../api/services/products";

export default function ProductGallery() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getProducts();
        setRows(Array.isArray(res.data) ? res.data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-28 p-4 max-w-screen-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">Product Gallery</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">Explore hand-crafted skincare products inspired by our workshops.</p>
        </div>

        {loading ? (
          <div className="py-10 text-center">Loading products…</div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No products available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((p) => (
              <div key={p._id} className="bg-white shadow rounded-lg overflow-hidden">
                <img src={p.image || "/images/placeholder.jpg"} alt={p.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <span className="text-sm">{typeof p.price === "number" ? `₵${p.price}` : "—"}</span>
                  </div>
                  {p.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>}
                  {p.relatedWorkshop && (
                    <div className="text-xs text-gray-500 mt-2">Linked workshop available</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
