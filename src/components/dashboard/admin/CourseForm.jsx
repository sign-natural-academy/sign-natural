// src/components/dashboard/admin/CourseForm.jsx
import React, { useEffect, useState, useRef } from "react";
import { createCourse, updateCourse } from "../../../api/services/courses";
import MediaPicker from "../../Media/MediaPicker"; //  added

const TYPE_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "online", label: "Online (Live)" },
  { value: "in-person", label: "In-Person" },
  { value: "in-demand", label: "On-Demand" },
];

export default function CourseForm({ selected, onSuccess }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    type: "free",
    image: null,                 // (File) unchanged
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  //  NEW (non-invasive): allow picking from library
  const [libAsset, setLibAsset] = useState(null);        // { secure_url, public_id }
  const [pickerOpen, setPickerOpen] = useState(false);   // modal

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
      });
      setPreview(selected.image || null);
      setLibAsset(null); // reset library selection on edit load
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
    });
    setPreview(null);
    setLibAsset(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file || null }));
    if (file) {
      setPreview(URL.createObjectURL(file));
      setLibAsset(null); // file overrides library pick
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("duration", form.duration);
    fd.append("category", form.category);
    fd.append("type", form.type);

    //  Prefer file; else use library URL + public_id
    if (form.image) {
      fd.append("image", form.image);
    } else if (libAsset?.secure_url) {
      fd.append("image", libAsset.secure_url);
      if (libAsset.public_id) fd.append("imagePublicId", libAsset.public_id);
    }

    try {
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
      alert(err.response?.data?.message || "❌ Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {selected ? "Edit Course" : "Add New Course"}
        </h3>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Course Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            type="text"
            placeholder="Enter course title"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter course description"
            rows="4"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* Price, Duration, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Price (₵)
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="0 for free"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Duration
            </label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              type="text"
              placeholder="e.g. 2 hours"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Skincare Basics"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-green-700"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Choose how this course is delivered (free/online/in-person/on-demand).
          </p>
        </div>

        {/* Image: Upload OR Library (UI kept; just one new button + preview logic) */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Course Image
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="px-4 py-2 border rounded"
            >
              Choose from Library
            </button>
            {(preview || libAsset?.secure_url) && (
              <button
                type="button"
                className="px-3 py-2 border rounded"
                onClick={() => {
                  setPreview(null);
                  setLibAsset(null);
                  setForm((p) => ({ ...p, image: null }));
                }}
              >
                Clear
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {(preview || libAsset?.secure_url) && (
            <div className="mt-3">
              <img
                src={preview || libAsset.secure_url}
                alt="Preview"
                className="w-full h-40 object-cover rounded border"
              />
              {libAsset?.public_id && (
                <div className="mt-1 text-xs text-gray-500 break-all">
                  public_id: {libAsset.public_id}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading
              ? selected
                ? "Updating..."
                : "Saving..."
              : selected
              ? "Update Course"
              : "Add Course"}
          </button>

          {selected && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Media Picker modal */}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initialFolder="signnatural/courses"
        onSelect={(asset) => {
          setLibAsset(asset);
          setPreview(null); // show library image instead of file preview
          setForm((p) => ({ ...p, image: null })); // make sure we don't send both
        }}
      />
    </>
  );
}
