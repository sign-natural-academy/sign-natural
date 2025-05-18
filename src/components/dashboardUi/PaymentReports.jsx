import React from 'react'

export default function  PaymentReports  ({Payments}) {
  return (
    <div>
            <h2 className="text-xl font-bold mb-3">Payment History</h2>
            <ul className="space-y-2">
              {Payments.map(payment => (
                <li key={payment.id} className="p-4 border rounded-md bg-white shadow-sm">
                  <strong>{payment.user}</strong> paid <span className="text-green-600">{payment.amount}</span> for {payment.item} – <em>{payment.status}</em>
                </li>
              ))}
            </ul>
          </div>
  )
}

