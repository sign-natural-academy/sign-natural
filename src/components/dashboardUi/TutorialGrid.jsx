// src/components/dashboard/user/TutorialGrid.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getCourses } from "../../api/services/courses"; // uses shared axios client
import { useNavigate, useLocation } from "react-router-dom";
import useProgress from "../../hooks/useProgress";

/**
 * TutorialGrid
 * - Lists free courses (type === "free")
 * - Video-first cards: YouTube embed OR HTML5 video if provided
 * - Search + client-side pagination
 * - Start Learning opens an inline modal player
 * - Continue-watching progress (localStorage-backed via useProgress)
 * - Resume-on-open for HTML5 videos
 */

export default function TutorialGrid() {
  const navigate = useNavigate();
  const location = useLocation();

  // state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // modal state
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerCourse, setPlayerCourse] = useState(null);

  // fetch free courses once
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
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

  // progress hook: watch current item ids
  // <-- Memoize ids so useProgress doesn't get a new array every render
  const ids = useMemo(() => items.map((c) => c._id), [items]);
  const { map: progressMap, get: getProgress, set: setProgress } = useProgress(ids);

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

  // helpers
  const convertYouTubeToEmbed = (url) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");
      if (host.includes("youtube.com")) {
        const v = u.searchParams.get("v");
        if (v) return `https://www.youtube.com/embed/${v}`;
      } else if (host.includes("youtu.be")) {
        const id = u.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    } catch {
      // not a full URL
    }
    return url;
  };

  const isYouTube = (url) => {
    if (!url) return false;
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");
      return host.includes("youtube.com") || host.includes("youtu.be");
    } catch {
      return false;
    }
  };

  const goToCourse = (id) => navigate(`/courses/${id}`);

  // open player modal
  // resumeRef holds fraction (0..1) to resume to for HTML5 videos
  const resumeRef = useRef(0);
  const videoRef = useRef(null);

  const openPlayer = (course) => {
    // read saved progress fraction (0..1)
    try {
      const id = course?._id;
      const prog = id ? (getProgress(id) ?? 0) : 0;
      resumeRef.current = typeof prog === "number" ? prog : 0;
      // ensure a record exists
      if (id && getProgress(id) === undefined) setProgress(id, 0);
    } catch {
      resumeRef.current = 0;
    }

    setPlayerCourse(course);
    setPlayerOpen(true);
  };

  const closePlayer = () => {
    setPlayerOpen(false);
    setPlayerCourse(null);
    resumeRef.current = 0;
  };

  // auto-open when URL contains ?id= and items are loaded
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const id = p.get("id");
    if (!id) return;
    if (items.length === 0) return; // wait until items loaded
    const found = items.find((c) => String(c._id) === String(id));
    if (found) {
      // open the player for that course
      // use setTimeout to avoid hook state updates during render in edge cases
      setTimeout(() => {
        openPlayer(found);
      }, 0);
    }
    // intentionally only depends on location.search and items
  }, [location.search, items]); // eslint-disable-line react-hooks/exhaustive-deps

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && playerOpen) closePlayer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playerOpen]);

  // Video handlers for HTML5 tracking + resume
  const onLoadedMetadata = () => {
    try {
      const v = videoRef.current;
      if (!v || !playerCourse) return;
      const resume = resumeRef.current || 0;
      if (resume > 0 && isFinite(v.duration) && v.duration > 0) {
        const target = Math.min(v.duration * resume, v.duration - 0.1);
        // set currentTime after a small timeout to be safe across browsers
        try {
          v.currentTime = target;
        } catch {
          // fallback: set after brief delay
          setTimeout(() => { try { v.currentTime = target; } catch {} }, 120);
        }
      }
    } catch {
      // ignore errors
    }
  };

  const onTimeUpdate = () => {
    try {
      const v = videoRef.current;
      if (!v || !playerCourse) return;
      const dur = v.duration || 0;
      const cur = v.currentTime || 0;
      if (!isFinite(dur) || dur === 0) return;
      const frac = Math.max(0, Math.min(1, cur / dur));
      setProgress(playerCourse._id, frac);
    } catch {
      // ignore
    }
  };

  const onEnded = () => {
    if (!playerCourse) return;
    setProgress(playerCourse._id, 1);
  };

  // UI
  return (
    <section className="bg-white p-4 rounded shadow">
      {/* Header + search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="font-semibold">Free Tutorials (Videos)</h3>
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
              <div className="h-40 bg-gray-200 rounded mb-3" />
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
              const videoUrl = c.videoUrl || c.video || "";
              const showYouTube = isYouTube(videoUrl);
              const cover = c.image || "/images/soap2.jpg";
              const prog = progressMap[c._id] ?? 0;

              return (
                <li key={c._id} className="border rounded p-3 flex flex-col">
                  {/* Video or cover */}
                  <div className="w-full mb-3">
                    {videoUrl ? (
                      showYouTube ? (
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            title={`yt-${c._id}`}
                            src={convertYouTubeToEmbed(videoUrl)}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-40 rounded"
                          />
                        </div>
                      ) : (
                        <video controls src={videoUrl} className="w-full h-40 object-cover rounded border" />
                      )
                    ) : (
                      <img src={cover} alt={c.title || "Course image"} className="w-full h-32 object-cover rounded mb-0" />
                    )}
                  </div>

                  <h4 className="font-medium line-clamp-2">{c.title}</h4>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {c.duration && <span>⏱ {c.duration}</span>}
                    {category && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
                        {category}
                      </span>
                    )}
                    {c.location && <span className="ml-auto text-xs text-gray-500">{c.location}</span>}
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {c.description || "No description"}
                  </p>

                  {/* Progress bar (show only when > 0) */}
                  {prog > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">Continue watching</div>
                        <div className="text-xs text-gray-600">{Math.round(prog * 100)}%</div>
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-100 h-2 rounded overflow-hidden">
                          <div
                            className="h-2 rounded"
                            style={{
                              width: `${Math.round(prog * 100)}%`,
                              backgroundColor: prog >= 1 ? "#16a34a" : "#7d4c35",
                              transition: "width 300ms ease",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTAs — Only Start Learning */}
                  <div className="mt-auto pt-3">
                    <button
                      onClick={() => {
                        // when clicking Start Learning inside the Tutorials tab, if user is authed
                        // you may want this to update the URL so sharing works. For now we just open player:
                        // openPlayer(c);
                        // but to keep parity with redirect behavior from other places, update URL too:
                        navigate(`/user-dashboard?tab=tutorials&id=${encodeURIComponent(c._id)}`);
                        // TutorialGrid's effect will pick up the id param and open player automatically.
                      }}
                      className="w-full inline-flex items-center justify-center px-3 py-2 text-sm bg-[#7d4c35] text-white rounded hover:opacity-90"
                      aria-label={`Start learning ${c.title}`}
                    >
                      Start Learning
                    </button>
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

      {/* Modal Player */}
      {playerOpen && playerCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closePlayer}
            aria-hidden="true"
          />

          {/* content */}
          <div className="relative bg-white rounded-lg max-w-3xl w-full mx-auto shadow-lg z-10 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="text-sm font-medium">{playerCourse.title}</div>
              <button
                onClick={closePlayer}
                aria-label="Close player"
                className="px-3 py-1 text-sm rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="p-4">
              {(() => {
                const videoUrl = playerCourse.videoUrl || playerCourse.video || "";
                const showYouTube = isYouTube(videoUrl);
                if (videoUrl) {
                  if (showYouTube) {
                    return (
                      <div className="w-full">
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            title={`player-${playerCourse._id}`}
                            src={convertYouTubeToEmbed(videoUrl)}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-96 rounded"
                          />
                        </div>

                        {/* YouTube can't be reliably tracked from iframe; provide manual complete action */}
                        <div className="mt-3 flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              // mark as complete (100%)
                              setProgress(playerCourse._id, 1);
                            }}
                            className="px-3 py-1 bg-green-700 text-white rounded text-sm"
                          >
                            Mark complete
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div>
                      <video
                        ref={videoRef}
                        controls
                        src={videoUrl}
                        className="w-full max-h-[480px] object-contain rounded"
                        onLoadedMetadata={onLoadedMetadata}
                        onTimeUpdate={onTimeUpdate}
                        onEnded={onEnded}
                      />
                      <div className="mt-3 text-xs text-gray-500">
                        Progress is saved locally.
                      </div>
                    </div>
                  );
                }
                // fallback: image + message
                return (
                  <div className="text-center text-gray-600 py-12">
                    <img src={playerCourse.image || "/images/soap2.jpg"} alt={playerCourse.title} className="mx-auto w-full max-w-md object-cover rounded mb-4" />
                    <div>No video available for this tutorial.</div>
                  </div>
                );
              })()}
            </div>

            <div className="p-3 border-t text-right">
              <button onClick={closePlayer} className="px-3 py-2 bg-gray-100 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
