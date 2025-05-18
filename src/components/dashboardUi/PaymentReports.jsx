import React from 'react';
import { Banknote, BadgeCheck, Clock } from 'lucide-react';

export default function PaymentReports({ Payments }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payment History</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Payments.map(payment => (
          <div
            key={payment.id}
            className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={`https://i.pravatar.cc/100?u=${payment.user}`}
                alt={payment.user}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h3 className="text-md font-semibold text-gray-900">{payment.user}</h3>
                <p className="text-sm text-gray-600">{payment.item}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium text-green-700">{payment.amount}</span>

              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                ${payment.status === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}
              >
                {payment.status === 'Paid' ? (
                  <>
                    <BadgeCheck className="w-4 h-4" />
                    Paid
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Pending
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
