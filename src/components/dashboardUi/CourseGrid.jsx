import React from "react";

export default function CourseGrid({ courses = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.length === 0 ? (
        <div className="p-6 bg-white rounded shadow">No courses yet.</div>
      ) : (
        courses.map((c) => (
          <div key={c.id} className="p-4 bg-white rounded shadow">
            <h4 className="font-semibold">{c.title}</h4>
            <p className="text-sm text-gray-600">{c.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
