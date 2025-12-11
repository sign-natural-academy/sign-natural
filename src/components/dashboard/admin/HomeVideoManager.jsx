// src/components/dashboard/admin/HomeVideoManager.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  adminGetHomeVideos,
  adminCreateHomeVideo,
  adminUpdateHomeVideo,
  adminDeleteHomeVideo,
} from "../../../api/services/homeVideo";

const MAX_VIDEO_BYTES = 10 * 1024 * 1024;

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
  } catch {
    // ignore
  }
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

export default function HomeVideoManager() {
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);

  const fileRef = useRef(null);

  const load = async () => {
    setLoadingList(true);
    setError("");
    try {
      const res = await adminGetHomeVideos();
      const list = Array.isArray(res.data) ? res.data : res.data?.items || [];
      setItems(list);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to load home videos.");
      setItems([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setVideoFile(null);
      setVideoPreview("");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      alert("Video must be 10 MB or smaller.");
      e.target.value = "";
      return;
    }
    setUploadBusy(true);
    setVideoFile(file);
    setYoutubeUrl("");
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setTimeout(() => setUploadBusy(false), 500);
  };

  const clearMedia = () => {
    setYoutubeUrl("");
    setVideoFile(null);
    setVideoPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }
    if (!youtubeUrl.trim() && !videoFile) {
      alert("Add a YouTube link or upload a video.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("caption", caption.trim());
      if (youtubeUrl.trim()) fd.append("youtubeUrl", youtubeUrl.trim());
      if (videoFile) fd.append("video", videoFile);

      await adminCreateHomeVideo(fd);
      clearMedia();
      setTitle("");
      setCaption("");
      await load();
    } catch (err) {
      console.error("Create home video failed:", err);
      alert(err?.response?.data?.message || "Failed to create home video.");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublish = async (id, current) => {
    try {
      await adminUpdateHomeVideo(id, { published: !current });
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update publish state.");
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Delete this home video?")) return;
    try {
      await adminDeleteHomeVideo(id);
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete home video.");
    }
  };

  // Derived: latest published (preview hint)
  const latestPublished = useMemo(
    () => items.find((i) => i.published) || null,
    [items]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Home page video</h2>
          <p className="text-xs text-gray-500">
            Short hero video shown on the main landing page.
          </p>
        </div>
        {latestPublished && (
          <div className="hidden sm:block text-xs text-gray-500 text-right">
            <div className="font-medium">Currently live</div>
            <div className="truncate max-w-[220px]">{latestPublished.title}</div>
          </div>
        )}
      </div>

      {/* Create form */}
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg shadow p-4 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: meta */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-700"
                placeholder="e.g. Welcome to Sign Natural"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Caption (optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-700"
                placeholder="Short message below the video"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">
                Video source
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  if (e.target.value) {
                    setVideoFile(null);
                    setVideoPreview("");
                    if (fileRef.current) fileRef.current.value = "";
                  }
                }}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="YouTube URL (optional)"
              />
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-3 py-2 border rounded text-sm inline-flex items-center gap-2"
                >
                  {uploadBusy && (
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        opacity="0.25"
                      />
                      <path
                        d="M22 12a10 10 0 0 1-10 10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  <span>{uploadBusy ? "Processing…" : "Upload video"}</span>
                </button>
                {(youtubeUrl || videoFile || videoPreview) && (
                  <button
                    type="button"
                    onClick={clearMedia}
                    className="px-3 py-2 border rounded text-xs"
                  >
                    Clear
                  </button>
                )}
                <span className="text-[11px] text-gray-500">
                  Max 10MB • YouTube or upload
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Right: live preview */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Preview
            </div>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {youtubeUrl && isYouTube(youtubeUrl) ? (
                <iframe
                  title="home-video-preview"
                  src={convertYouTubeToEmbed(youtubeUrl)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : latestPublished ? (
                // Show current live video when nothing selected
                isYouTube(latestPublished.videoUrl) ? (
                  <iframe
                    title="home-video-live"
                    src={convertYouTubeToEmbed(latestPublished.videoUrl)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={latestPublished.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <span className="text-xs text-gray-500">
                  No video yet. Add one on the left.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-green-700 text-white rounded text-sm hover:bg-green-800 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save & publish"}
          </button>
        </div>
      </form>

      {/* List existing videos */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Previous uploads</h3>
        </div>

        {loadingList ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-600">No home videos yet.</div>
        ) : (
          <ul className="divide-y">
            {items.map((v) => (
              <li
                key={v._id}
                className="py-2 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {v.title}
                  </div>
                  {v.caption && (
                    <div className="text-xs text-gray-500 truncate">
                      {v.caption}
                    </div>
                  )}
                  <div className="text-[11px] text-gray-400">
                    {v.published ? "Published" : "Draft"} •{" "}
                    {v.createdAt
                      ? new Date(v.createdAt).toLocaleString()
                      : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublish(v._id, v.published)}
                    className={`px-3 py-1 rounded text-xs ${
                      v.published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {v.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(v._id)}
                    className="px-3 py-1 border rounded text-xs text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
