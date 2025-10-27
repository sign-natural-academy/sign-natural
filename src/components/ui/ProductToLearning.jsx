// src/components/ui/ProductsToLearning.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// API (expects: GET /api/products?limit=6 to return [{ _id, name, description, price, image, relatedWorkshop, relatedWorkshopTitle? }])
import { getProducts } from "../../api/services/products";

const FALLBACK = [
  { name: "Shea Body Butter", description: "Rich, creamy body butter made with raw Ghanaian shea butter and essential oils.", price: 45.99, relatedWorkshopTitle: "Body Butter Creation", image: "/soap.jpg" },
  { name: "Cocoa Facial Mask", description: "Rejuvenating facial mask with pure Ghanaian cocoa and clay.", price: 40.99, relatedWorkshopTitle: "Natural Facial Masks Masterclass", image: "/body-2.jpg" },
  { name: "Baobab Hair Oil", description: "Nourishing hair oil blend with baobab oil.", price: 39.99, relatedWorkshopTitle: "Natural Haircare Workshop", image: "/boabab.jpg" }
];

function ghPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₵—";
  return `₵${n.toFixed(2)}`;
}

export default function ProductsToLearning({ limit = 6, className = "" }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getProducts({ limit });
        const list = Array.isArray(res.data) ? res.data : [];
        if (!active) return;

        // Normalize fields from backend → UI
        const normalized = list.map(p => ({
          id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image || "/images/placeholder.jpg",
          relatedWorkshop: p.relatedWorkshop || null,
          relatedWorkshopTitle: p.relatedWorkshopTitle || p.relatedWorkshop?.title || null,
        }));

        setItems(normalized.length ? normalized : FALLBACK);
      } catch {
        if (!active) return;
        setItems(FALLBACK);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [limit]);

  return (
    <section className={`py-12 px-4 text-center bg-[#FCD28A] ${className}`}>
      <h2 className="text-3xl font-bold text-[#472B2B] mb-2">From Products to Learning</h2>
      <p className="text-[#6b4c4c] mb-10">
        Love our products? Learn how to make your own version in our specialized workshops.
      </p>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {(loading ? Array.from({ length: 3 }) : items).map((product, idx) => (
          <motion.div
            key={product?.id || idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-lg shadow p-4 relative text-left"
          >
            {/* Image / Skeleton */}
            {loading ? (
              <div className="rounded-t-md h-48 w-full bg-gray-100 animate-pulse" />
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="rounded-t-md h-48 w-full object-cover"
              />
            )}

            {/* Price badge */}
            <span className="absolute top-4 right-4 bg-[#d6b88f] text-white font-semibold px-3 py-1 rounded">
              {loading ? "—" : ghPrice(product.price)}
            </span>

            <div className="mt-4">
              {/* Name / Desc */}
              <h3 className="text-xl font-semibold">
                {loading ? <span className="inline-block h-5 w-40 bg-gray-100 rounded animate-pulse" /> : product.name}
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                {loading ? <span className="inline-block h-4 w-3/4 bg-gray-100 rounded animate-pulse" /> : product.description}
              </p>
{/* Related workshop card */}
<div className="bg-[#f5efe7] p-3 rounded mt-4">
  <p className="text-xs text-gray-600 mb-1">Related Workshop:</p>
  <p className="font-semibold">
    {loading
      ? <span className="inline-block h-4 w-48 bg-gray-100 rounded animate-pulse" />
      : (product?.relatedWorkshopTitle || "—")}
  </p>

  <button
    disabled={loading || !(product && product.relatedWorkshop)}
    onClick={() => {
      if (!loading && product?.relatedWorkshop) {
        // you can deep-link later; for now, go to /workshop
        // e.g. navigate(`/workshop?highlight=${product.relatedWorkshop}`)
        navigate("/workshop");
      }
    }}
    className={`bg-white text-gray px-4 py-2 rounded mt-2 transition
      ${!loading && product?.relatedWorkshop ? "hover:bg-[#E1AD01]" : "opacity-60 cursor-not-allowed"}`}
  >
    Make Your Own Version
  </button>
</div>

              {/* CTA: View Product */}
              {/* <button
                disabled={loading}
                onClick={() => navigate("")}
                className="w-full mt-4 border border-gray-400 py-2 rounded hover:bg-gray-100 transition disabled:opacity-60"
              >
                View Product
              </button> */}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
