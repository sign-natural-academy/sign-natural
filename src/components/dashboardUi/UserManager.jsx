import React from 'react';
import { UserCheck } from 'lucide-react';

export default function UserManager({ Users }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registered Users</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Users.map(user => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src={`https://i.pravatar.cc/100?u=${user.name}`}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h3 className="text-md font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.role}</p>
                <p className="text-xs text-gray-400">Joined: {user.joined}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
