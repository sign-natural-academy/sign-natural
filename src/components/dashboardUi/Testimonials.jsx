import React, { useState, useEffect } from 'react';

export default function Testimonials({ testimonials = [], options = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    item: '', // course/workshop
    rating: 0,
  });

  const [allTestimonials, setAllTestimonials] = useState(testimonials);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch courses/workshops dynamically later if needed
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTestimonial = {
      id: allTestimonials.length + 1,
      ...formData,
      date: new Date().toISOString().split('T')[0],
    };

    setAllTestimonials([newTestimonial, ...allTestimonials]);
    setFormData({ name: '', message: '', item: '', rating: 0 });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const renderStars = (count) =>
    '★'.repeat(count) + '☆'.repeat(5 - count);

  return (
    <div className="space-y-8">
      {/* Testimonials List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">What Users Are Saying</h2>

        {allTestimonials.length === 0 ? (
          <p className="text-gray-500">No testimonials yet. Be the first to share!</p>
        ) : (
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {allTestimonials.map((t) => (
              <div
                key={t.id}
                className="min-w-[250px] max-w-sm bg-gray-50 rounded-xl p-5 shadow hover:shadow-lg transition flex-shrink-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1 font-semibold">📘 {t.item}</p>
                <p className="text-yellow-500 text-sm mb-2">{renderStars(t.rating)}</p>
                <p className="text-gray-700 italic">"{t.message}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Share Your Experience</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />

          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a Course or Workshop</option>
            {options.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rating:</p>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-xl ${
                  formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            name="message"
            placeholder="Your Testimonial"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
          >
            Submit
          </button>

          {submitted && (
            <p className="text-green-600 mt-3 animate-pulse">
              ✅ Thank you for your feedback!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
