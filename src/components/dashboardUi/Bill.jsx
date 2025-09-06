import React from "react";

export default function Bill({ payments = [] }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-semibold mb-3">Payments</h3>
      {payments.length === 0 ? (
        <div>No payments recorded.</div>
      ) : (
        payments.map((p) => (
          <div key={p.id} className="flex justify-between text-sm py-2 border-b last:border-b-0">
            <div>{p.item}</div>
            <div className="text-gray-600">{p.amount}</div>
          </div>
        ))
      )}
    </div>
  );
}
