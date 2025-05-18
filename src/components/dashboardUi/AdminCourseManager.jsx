import React from 'react'

export default function AdminCourseManager({Classes}){
  return (
    <>
     <div>
            <h2 className="text-xl font-bold mb-3">All Classes</h2>
            <ul className="space-y-2">
              {Classes.map(cls => (
                <li key={cls.id} className="p-4 border rounded-md bg-white shadow-sm">
                  <strong>{cls.title}</strong> ({cls.type} - {cls.location}) – <span className="text-blue-500">{cls.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Create a New Class</h2>
            <form className="space-y-4 max-w-md">
              <input className="w-full p-2 border rounded" type="text" placeholder="Class Title" />
              <select className="w-full p-2 border rounded">
                <option value="">Select Type</option>
                <option>Online</option>
                <option>In-Person</option>
              </select>
              <input className="w-full p-2 border rounded" type="text" placeholder="Location (if in-person)" />
              <button className="bg-green-600 text-white px-4 py-2 rounded">Create Class</button>
            </form>
          </div>

          </>

          
  )
}
