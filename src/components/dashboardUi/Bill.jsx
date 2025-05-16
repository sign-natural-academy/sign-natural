import { useState } from 'react';

export default function Bill  ({ payments })  {
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');

  const handlePayment = () => {
    // Placeholder for Paystack interaction
    alert(`Processing payment for: ${item} - ₵${amount}`);
    // Integrate Paystack here (e.g., using react-paystack)
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Billing</h2>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Booking Payment</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Item name (e.g. Event Ticket)"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Amount (₵)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            onClick={handlePayment}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Pay Now
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Payment History</h3>
        <ul className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <li key={payment.id} className="py-2 flex justify-between">
              <span>{payment.item} ({payment.date})</span>
              <span className={`font-semibold ${payment.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {payment.amount} - {payment.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

