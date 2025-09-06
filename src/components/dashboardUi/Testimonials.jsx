import React from "react";

export default function Testimonials({ testimonials = [] }) {
  return (
    <div className="space-y-3">
      {testimonials.length === 0 ? (
        <div className="p-4 bg-white rounded shadow">No testimonials yet.</div>
      ) : (
        testimonials.map((t) => (
          <div key={t.id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold">{t.name}</div>
            <div className="text-sm text-gray-600">{t.message}</div>
          </div>
        ))
      )}
    </div>
  );
}
