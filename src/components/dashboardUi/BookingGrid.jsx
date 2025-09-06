import React from "react";

export default function BookingGrid({ bookings = [] }) {
  return (
    <div className="space-y-3">
      {bookings.length === 0 ? (
        <div className="p-4 bg-white rounded shadow">No bookings.</div>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{b.item}</div>
              <div className="text-sm text-gray-500">{b.date}</div>
            </div>
            <div className="text-sm font-medium">{b.status}</div>
          </div>
        ))
      )}
    </div>
  );
}
