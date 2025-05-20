import React, { useState, useEffect } from 'react';

export default function Testimonials({ testimonials = [] }) {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [allTestimonials, setAllTestimonials] = useState(testimonials);
  const [submitted, setSubmitted] = useState(false);

  // OPTIONAL: Fetch from API when backend is ready
  useEffect(() => {
    // fetch('/api/testimonials')
    //   .then(res => res.json())
    //   .then(data => setAllTestimonials(data))
    //   .catch(err => console.error('Error fetching testimonials:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTestimonial = {
      id: allTestimonials.length + 1,
      name: formData.name,
      message: formData.message,
      date: new Date().toISOString().split('T')[0],
    };

    // Add locally
    setAllTestimonials([newTestimonial, ...allTestimonials]);

    // Send to backend when ready
    // fetch('/api/testimonials', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newTestimonial),
    // });

    setFormData({ name: '', message: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Helper to get initials
  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <div className="space-y-8">
      {/* Scrollable Testimonials Section */}
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
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
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
