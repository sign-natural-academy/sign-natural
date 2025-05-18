import React from 'react';

export default function AdminProfile() {
  // Dummy fallback admin info
  const admin = {
    name: 'Nana ',
    email: 'admin@signnatural.com',
    role: 'Super Admin',
    joined: 'January 5, 2023',
    image: 'https://source.unsplash.com/80x80/?face,portrait'
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center space-x-4">
        <img
          src={admin.image}
          alt={admin.name}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{admin.name}</h2>
          <p className="text-gray-600">{admin.email}</p>
          <p className="text-sm text-blue-600 font-medium">{admin.role}</p>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p><span className="font-semibold text-gray-700">Joined on:</span> {admin.joined}</p>
      </div>

      <div className="mt-4">
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md shadow hover:bg-blue-700 transition">
          Update Profile
        </button>
      </div>
    </div>
  );
}
