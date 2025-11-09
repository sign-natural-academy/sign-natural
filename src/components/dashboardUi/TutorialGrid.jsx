// src/components/dashboard/user/TutorialGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getCourses } from "../../api/services/courses"; // uses shared axios client

/**
 * TutorialGrid
 * - Lists free courses (type === "free")
 * - Search + client-side pagination
 * - Funnel CTAs: View / Book a class / Shop related
 */
export default function TutorialGrid() {
  // state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // fetch free courses once
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        // backend supports ?type=free
        const res = await getCourses({ type: "free", limit: 200 });
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : res.data?.items || [];
        setItems(list);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || "Failed to load tutorials.");
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // search + pagination
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((c) => {
      const t = (c.title || "").toLowerCase();
      const d = (c.description || "").toLowerCase();
      return t.includes(s) || d.includes(s);
    });
  }, [items, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const slice = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  // handlers
  const onSearch = (e) => { setQ(e.target.value); setPage(1); };
  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => setPage((p) => Math.min(totalPages, p + 1));

  // UI
  return (
    <section className="bg-white p-4 rounded shadow">
      {/* Header + search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="font-semibold">Free Tutorials</h3>
        <input
          value={q}
          onChange={onSearch}
          placeholder="Search tutorials…"
          className="border px-3 py-2 rounded w-full sm:w-64"
          aria-label="Search tutorials"
        />
      </div>

      {/* Loading */}
      {loading && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <li key={i} className="animate-pulse border rounded p-3">
              <div className="h-28 bg-gray-200 rounded mb-3" />
              <div className="h-3 bg-gray-200 rounded mb-2 w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-8 text-center text-red-600">{error}</div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="py-8 text-center text-gray-500">No free tutorials found.</div>
      )}

      {/* Cards */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slice.map((c) => {
              const category = (c.category || "").trim();
              const viewHref = `/courses/${c._id}`;
              const bookHref = `/workshops${
                category
                  ? `?fromCourse=${encodeURIComponent(c._id)}&category=${encodeURIComponent(category)}`
                  : `?fromCourse=${encodeURIComponent(c._id)}`
              }`;
              const shopHref = `/products${
                category
                  ? `?fromCourse=${encodeURIComponent(c._id)}&category=${encodeURIComponent(category)}`
                  : `?fromCourse=${encodeURIComponent(c._id)}`
              }`;

              return (
                <li key={c._id} className="border rounded p-3 flex flex-col">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.title || "Course image"}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}

                  <h4 className="font-medium line-clamp-2">{c.title}</h4>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {c.duration && <span>⏱ {c.duration}</span>}
                    {category && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
                        {category}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {c.description || "No description"}
                  </p>

                  {/* CTAs */}
                  <div className="mt-auto pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <a
                      href={viewHref}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm border rounded hover:bg-gray-50"
                      aria-label={`View ${c.title}`}
                    >
                      View
                    </a>
                    <a
                      href={bookHref}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm bg-[#7d4c35] text-white rounded hover:opacity-90"
                      aria-label={`Book a class for ${c.title}`}
                    >
                      Book a class
                    </a>
                    <a
                      href={shopHref}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm border rounded hover:bg-gray-50"
                      aria-label={`Shop related to ${c.title}`}
                    >
                      Shop related
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={prev}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={next}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
