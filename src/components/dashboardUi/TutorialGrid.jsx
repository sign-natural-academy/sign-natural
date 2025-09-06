import React from "react";

export default function TutorialGrid({ tutorials = [] }) {
  return (
    <div className="space-y-4">
      {tutorials.length === 0 ? (
        <div className="p-4 bg-white rounded shadow">No tutorials available.</div>
      ) : (
        tutorials.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold">{t.title}</h4>
            <p className="text-sm text-gray-600">{t.description}</p>
            <div className="mt-2">
              <a href={t.url} target="_blank" rel="noreferrer" className="text-green-700 underline text-sm">Watch</a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
