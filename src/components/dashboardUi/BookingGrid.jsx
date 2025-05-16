import React from 'react';

const dummyBookings = [
  { id: 1, title: 'Herbal Treatments', date: '2024-05-10' },
  { id: 2, title: 'Organic Soap Making', date: '2024-06-01' },
  { id: 3, title: 'DIY Skincare Basics', date: '2024-06-15' },
  { id: 4, title: 'Essential Oils Workshop', date: '2024-07-05' },
  { id: 5, title: 'Aromatherapy Basics', date: '2024-07-20' },
];

export default function BookingGrid({ bookings = [] }) {
  const allBookings = bookings.length ? bookings : dummyBookings;

  return (
    <div className="mt12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {allBookings.map(booking => (
        <div key={booking.id} className=" p-4 rounded-xl shadow-sm">
          <h4 className="font-semibold text-sm">{booking.title}</h4>
          <p className="text-xs text-gray-500">Date: {booking.date}</p>
        </div>
      ))}
    </div>
  );
}
