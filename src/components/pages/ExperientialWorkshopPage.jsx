import React, { useEffect, useState } from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import WorkshopCard from "../ui/WorkshopCard";
import WorkshopFilters from "../ui/WorkshopFilters";
import WorkshopDetailsModal from "../ui/WorkshopDetailsModal";
import { getWorkshops } from "../../api/services/workshops";

export default function ExperientialWorkshopPage() {
  const [workshops, setWorkshops] = useState([]);
  const [filter, setFilter] = useState("all"); // celebration | diasporan | group | other | all
  const [loading, setLoading] = useState(true);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openDetails = (id) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedId(null);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (filter !== "all") params.type = filter;
        const res = await getWorkshops(params);
        setWorkshops(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load workshops:", err);
        setWorkshops([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-screen-lg mx-auto pt-28">
        {/* Hero (mirrors LearnPage) */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-semibold text-[#4b2e20] mb-4">
            Experiential Workshops
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Turn skincare education into memorable experiences with our specialized workshops.
          </p>
        </div>

        {/* Filters (same placement as LearnPage) */}
        <WorkshopFilters currentFilter={filter} onFilterChange={setFilter} />

        {/* Results */}
        {loading ? (
          <div className="py-10 text-center">Loading workshops…</div>
        ) : workshops.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No workshops found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((w) => (
              <WorkshopCard key={w._id} workshop={w} onView={openDetails} />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Details modal */}
      <WorkshopDetailsModal
        open={detailsOpen}
        onClose={closeDetails}
        workshopId={selectedId}
      />
    </>
  );
}
