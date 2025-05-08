import React from "react";
import Navbar from "./Navbar";

export default function RefundPolicy() {
  return (
    <div>
        <Navbar/>
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">

<h1 className="text-3xl font-bold mb-6 text-green-900">General Policy Overview</h1>
    <p className="mb-4"> 
        Sign Natural Academy is committed to providing high-quality educational experiences in 
natural skincare formulation and holistic wellness. We believe in transparency, integrity, and 
mutual respect in every interaction with our learners and clients. By using our platform and 
participating in any of our trainings, you agree to comply with the policies outlined below. </p>
      <h1 className="text-3xl font-bold mb-6 text-green-900">Refund Policy</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="font-semibold text-base">1. Digital Products (Recorded Courses / Downloadables)</h2>
          <p>
            All sales are final for digital products. Due to the nature of downloadable content, we do not
            offer refunds once access has been granted.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base">2. Live or Group Workshops (Online or In-person)</h2>
          <ul className="list-disc pl-5">
            <li>
              Cancellations made at least 7 days before the scheduled event are eligible for a 50% refund or a full credit toward a future workshop.
            </li>
            <li>
              Cancellations made less than 7 days before the workshop are non-refundable, but we may allow you to reschedule once for a future date.
            </li>
            <li>No-shows are not eligible for refunds or credits.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base">3. Private Events (Birthday sessions, Diaspora workshops, etc.)</h2>
          <ul className="list-disc pl-5">
            <li>A non-refundable deposit of 30% is required for booking to secure your date.</li>
            <li>Balance is due 3 days before the event.</li>
            <li>Cancellations more than 10 days in advance may be eligible for partial credit.</li>
            <li>Cancellations within 10 days of the event are non-refundable.</li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
}
