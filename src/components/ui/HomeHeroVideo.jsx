// src/components/ui/HomeHeroVideo.jsx
import React, { useEffect, useState } from "react";
import { getHomeVideo } from "../../api/services/homeVideo";

function convertYouTubeToEmbed(url) {
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
  } catch {}
  return url;
}

function isYouTube(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    return host.includes("youtube.com") || host.includes("youtu.be");
  } catch {
    return false;
  }
}

export default function HomeHeroVideo() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getHomeVideo();
        if (!mounted) return;
        setVideo(res.data || null);
      } catch {
        if (!mounted) return;
        setVideo(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // nothing to show
  if (!video && !loading) return null;

  const yt = video ? isYouTube(video.videoUrl) : false;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#faf5f1] via-[#f7f2ec] to-[#f5f5f5] py-12 md:py-20">
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#7d4c35]/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#455f30]/5 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <div className="h-8 bg-white/70 rounded-md shadow-sm animate-pulse" />
              <div className="h-16 bg-white/60 rounded-md shadow-sm animate-pulse" />
            </div>
            <div className="rounded-2xl bg-gray-200/80 animate-pulse w-full h-56 md:h-72 lg:h-80" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* LEFT: Title + Description (no buttons) */}
            <div className="space-y-4 md:space-y-5">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 leading-tight">
                {video?.title}
              </h1>
              {video?.caption && (
                <p className="text-sm md:text-base text-gray-600 max-w-lg leading-relaxed">
                  {video.caption}
                </p>
              )}
            </div>

            {/* RIGHT: Video frame */}
            <div className="relative">
              <div className="relative w-full h-56 md:h-72 lg:h-80 rounded-2xl bg-black overflow-hidden shadow-xl shadow-black/10 ring-1 ring-black/5">
                {yt ? (
                  <iframe
                    title="home-hero-video"
                    src={convertYouTubeToEmbed(video.videoUrl)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}

                {/* soft bottom gradient for visual polish */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
