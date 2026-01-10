// src/components/dashboard/admin/CourseForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { createCourse, updateCourse } from "../../../api/services/courses";
import MediaPicker from "../../Media/MediaPicker"; // existing media picker component

const TYPE_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "online", label: "Online (Live)" },
  { value: "in-person", label: "In-Person" },
  { value: "in-demand", label: "On-Demand" },
];

const MAX_VIDEO_BYTES = 100 * 1024 * 1024// 100 MB

// Small inline spinner used by upload buttons
function SmallSpinner() {
  return (
    <svg className="w-4 h-4 inline-block animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// tiny remove icon (X)
function RemoveIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CourseForm({ selected, onSuccess }) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    type: "free",
    image: null,
    location: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload processing flags for UX spinner
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [libAsset, setLibAsset] = useState(null);

  useEffect(() => {
    if (selected) {
      setForm({
        title: selected.title || "",
        description: selected.description || "",
        price: selected.price ?? "",
        duration: selected.duration || "",
        category: selected.category || "",
        type: selected.type || "free",
        image: null,
        location: selected.location || "",
      });

      setImagePreview(selected.image || null);
      if (selected.videoUrl) {
        setVideoUrl(selected.videoUrl);
        setVideoPreview(selected.videoUrl);
      } else if (selected.video) {
        setVideoPreview(selected.video);
      } else {
        setVideoPreview(null);
      }

      setVideoFile(null);
      setLibAsset(null);
    } else {
      resetForm();
    }
  }, [selected]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      duration: "",
      category: "",
      type: "free",
      image: null,
      location: "",
    });
    setImagePreview(null);
    setVideoPreview(null);
    setVideoFile(null);
    setVideoUrl("");
    setLibAsset(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Image selection: show spinner while creating preview (small UX cue)
  const onImageFile = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((p) => ({ ...p, image: file }));
    setLibAsset(null);

    if (file) {
      setImageUploading(true);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setTimeout(() => setImageUploading(false), 600);
    } else {
      setImagePreview(null);
    }
  };

  // Video selection: validate size, preview, spinner
// ---------------- VIDEO FILE ----------------
const onVideoFile = (e) => {
  const file = e.target.files?.[0] ?? null;
  if (file && file.size > MAX_VIDEO_BYTES) {
    alert("Video must be ≤ 100 MB.");
    return;
  }

  setVideoFile(file);
  setVideoUrl("");

  if (file) {
    setVideoUploading(true);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setTimeout(() => setVideoUploading(false), 700);
  } else {
    setVideoPreview(null);
  }
};

// ---------------- YOUTUBE ----------------
const onYouTubeChange = (e) => {
  const v = e.target.value;
  setVideoUrl(v);
  setVideoFile(null);
  setVideoPreview(v || null);
};

// ---------------- MEDIA PICKER ----------------
const onPickerSelect = (asset) => {
  setLibAsset(asset);

  if (asset.resource_type?.startsWith("video")) {
    setVideoPreview(asset.secure_url);
    setVideoUrl("");
    setVideoFile(null);
  }

  if (!asset.resource_type || asset.resource_type.startsWith("image")) {
    setImagePreview(asset.secure_url);
    setForm((p) => ({ ...p, image: null }));
  }
};
  const clearVideoSelection = () => {
    setVideoPreview(null);
    setVideoFile(null);
    setVideoUrl("");
    setLibAsset(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("duration", form.duration);
      fd.append("category", form.category);
      fd.append("type", form.type);
      fd.append("location", form.location || "");

      if (form.image) {
        fd.append("image", form.image);
      } else if (libAsset && (!libAsset.resource_type || libAsset.resource_type.startsWith("image"))) {
        if (libAsset.secure_url) fd.append("image", libAsset.secure_url);
        if (libAsset.public_id) fd.append("imagePublicId", libAsset.public_id);
      } else if (imagePreview && typeof imagePreview === "string" && imagePreview.startsWith("http")) {
        fd.append("image", imagePreview);
      }

      if (videoFile) {
        fd.append("video", videoFile);
      } else if (videoUrl && videoUrl.trim()) {
        fd.append("videoUrl", videoUrl.trim());
      } else if (libAsset && libAsset.resource_type && libAsset.resource_type.startsWith("video")) {
        if (libAsset.secure_url) fd.append("videoUrl", libAsset.secure_url);
        if (libAsset.public_id) fd.append("videoPublicId", libAsset.public_id);
      } else if (videoPreview && typeof videoPreview === "string" && videoPreview.startsWith("http")) {
        fd.append("videoUrl", videoPreview);
      }

      if (selected?._id) {
        await updateCourse(selected._id, fd);
        alert("Course updated successfully!");
      } else {
        await createCourse(fd);
        alert("New course added successfully!");
      }

      resetForm();
      onSuccess?.();
    } catch (err) {
      console.error("Error saving course:", err);
      alert(err?.response?.data?.message || "❌ Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {selected ? "Edit Course" : "Add New Course"}
        </h3>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Course Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            type="text"
            placeholder="Enter course title"
            required
            className="w-full shadow border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter course description"
            rows="4"
            className="w-full shadow border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Price, Duration, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Price (₵)</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="0 for free"
              className="w-full shadow border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Duration</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              type="text"
              placeholder="e.g. 2 hours"
              className="w-full shadow border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Skincare Basics"
              className="w-full shadow border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>
        </div>

        {/* Type and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full shadow border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Accra / Online"
              className="w-full shadow border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>
        </div>

        {/* Image: Upload OR Library */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Cover</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current.click()}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition flex items-center gap-2"
            >
              {imageUploading ? <SmallSpinner /> : null}
              <span>{imageUploading ? "Processing…" : "Upload Image"}</span>
            </button>

            <button type="button" onClick={() => { setPickerOpen(true); }} className="px-4 py-2 border rounded">
              Library
            </button>

            {(imagePreview || libAsset?.secure_url) && (
              <button type="button" className="px-3 py-2 shadow rounded" onClick={() => { setImagePreview(null); setLibAsset(null); setForm((p) => ({ ...p, image: null })); }}>
                Clear
              </button>
            )}
          </div>

          <input type="file" ref={imageInputRef} accept="image/*" onChange={onImageFile} className="hidden" />

          {(imagePreview || (libAsset && (!libAsset.resource_type || libAsset.resource_type.startsWith("image")) && libAsset.secure_url)) && (
            <div className="mt-3">
              <img src={imagePreview || libAsset.secure_url} alt="Preview" className="w-full h-40 object-cover rounded shadow" />
              {libAsset?.public_id && <div className="mt-1 text-xs text-gray-500 break-all">public_id: {libAsset.public_id}</div>}
            </div>
          )}
        </div>

        {/* Video: YouTube OR Upload OR Library — simplified & rearranged UI */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Course Video (YouTube or Upload)</label>

          {/* Row: youtube input + upload buttons */}
          <div className="flex flex-col sm:flex-row gap-2 items-start">
            <input
              type="text"
              placeholder="paste YouTube link"
              value={videoUrl}
              onChange={onYouTubeChange}
              className="flex-1 shadow px-3 py-2 rounded w-full"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => videoInputRef.current.click()}
                className="px-4 py-2 shadow rounded flex items-center gap-2"
              >
                {videoUploading ? <SmallSpinner /> : null}
                <span>{videoUploading ? "Processing…" : "Upload"}</span>
              </button>

              <button type="button" onClick={() => setPickerOpen(true)} className="px-4 py-2 shadow rounded">
                Library
              </button>

              {(videoPreview || libAsset?.secure_url) && (
                <button type="button" className="px-3 py-2 shadow rounded" onClick={() => { clearVideoSelection(); }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <input type="file" ref={videoInputRef} accept="video/*" onChange={onVideoFile} className="hidden" />
          <div className="text-xs text-gray-500 mt-1">≤ 100 MB</div>

          {/* Preview always appears below the controls — prevents overlap */}
          <div className="mt-3">
            {videoPreview ? (
              <div className="relative">
                {/* Remove button (top-right) */}
                <button
                  type="button"
                  onClick={clearVideoSelection}
                  title="Remove video"
                  className="absolute right-2 top-2 z-20 bg-white/90 hover:bg-white text-gray-700 border rounded-full p-1 shadow"
                >
                  <RemoveIcon />
                </button>

                {(videoUrl && videoUrl.includes("youtube")) ? (
                  <div className="relative" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      title="youtube-preview"
                      src={convertYouTubeToEmbed(videoUrl)}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <video controls src={videoPreview} className="w-full h-40 object-cover rounded shadow" />
                    {libAsset?.public_id && <div className="mt-1 text-xs text-gray-500 break-all">public_id: {libAsset.public_id}</div>}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No video selected</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <button type="submit" disabled={loading} className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition disabled:opacity-50">
            {loading ? (selected ? "Updating..." : "Saving...") : (selected ? "Update Course" : "Add Course")}
          </button>

          {selected && (
            <button type="button" onClick={resetForm} className="text-sm text-gray-600 hover:underline">Cancel Edit</button>
          )}
        </div>
      </form>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initialFolder="signnatural/courses"
        onSelect={(asset) => {
          onPickerSelect(asset);
          setPickerOpen(false);
        }}
      />
    </>
  );
}

/**
 * Convert common youtube URL forms into embed url.
 * If input isn't a YouTube link, returns input unchanged.
 */
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
    // not a full URL; return as-is
  }
  return url;
}
