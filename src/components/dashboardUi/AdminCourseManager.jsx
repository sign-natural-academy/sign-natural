import React from 'react';

const dummyClasses = [
  {
    id: 1,
    title: 'Shea Butter Masterclass',
    type: 'Online',
    location: '-',
    status: 'Active',
    image: 'https://source.unsplash.com/featured/?shea,butter'
  },
  {
    id: 2,
    title: 'Skincare Workshop Accra',
    type: 'In-Person',
    location: 'Accra',
    status: 'Upcoming',
    image: 'https://source.unsplash.com/featured/?skincare,workshop'
  },
  {
    id: 3,
    title: 'Black Soap Making',
    type: 'Online',
    location: '-',
    status: 'Completed',
    image: 'https://source.unsplash.com/featured/?soap,organic'
  },
  {
    id: 4,
    title: 'Essential Oils Class',
    type: 'On-Demand',
    location: '-',
    status: 'Active',
    image: 'https://source.unsplash.com/featured/?essential,oils'
  },
  {
    id: 5,
    title: 'Natural Hair Care Workshop',
    type: 'In-Person',
    location: 'Kumasi',
    status: 'Upcoming',
    image: 'https://source.unsplash.com/featured/?natural,hair'
  }
];

export default function AdminCourseManager() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Classes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dummyClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all "
          >
            <img
              src={cls.image}
              alt={cls.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{cls.title}</h3>
              <p className="text-sm text-gray-600">Type: {cls.type}</p>
              <p className="text-sm text-gray-600">Location: {cls.location}</p>
              <p
                className={`mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full
                  ${cls.status === 'Active' ? 'bg-green-100 text-green-800'
                    : cls.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {cls.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
