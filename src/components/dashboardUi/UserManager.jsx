import React from 'react';

export default function UserManager({ Users }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Registered Users</h2>
      <ul className="space-y-2">
        {Users.map(user => (
          <li key={user.id} className="p-4 border rounded-md bg-white shadow-sm">
            <strong>{user.name}</strong> – {user.role} (Joined: {user.joined})
          </li>
        ))}
      </ul>
    </div>
  );
}

