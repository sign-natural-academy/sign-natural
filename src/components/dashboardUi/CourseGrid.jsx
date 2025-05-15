import React, { useEffect, useState } from 'react';

const dummyCourses = [
  { id: 1, title: 'Natural Skincare 101', category: 'Online Course', image: '/images/course1.jpg' },
  { id: 2, title: 'Herbal Treatments', category: 'Workshop', image: '/images/course2.jpg' },
  { id: 3, title: 'Organic Soap Making', category: 'Online Course', image: '/images/course3.jpg' },
  { id: 4, title: 'DIY Skincare Basics', category: 'Workshop', image: '/images/course4.jpg' },
  { id: 5, title: 'Essential Oils Guide', category: 'Online Course', image: '/images/course5.jpg' },
];

export default function CourseGrid({ courses = [] }) {
  const [loadedCourses, setLoadedCourses] = useState([]);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setLoadedCourses(courses.length ? courses : dummyCourses);
    }, 500);
  }, [courses]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {loadedCourses.map(course => (
        <div key={course.id} className="border rounded-xl p-2 shadow-md">
          <img src={course.image} alt={course.title} className="rounded-lg mb-2 w-full h-32 object-cover" />
          <h3 className="text-sm font-semibold">{course.title}</h3>
          <p className="text-xs text-gray-500">{course.category}</p>
        </div>
      ))}
    </div>
  );
}
