import React from "react";
import { Footer } from "./Footer";
import Navbar from "./Navbar";

export default function TermsAndConditions() {
  return (
    <div>
        <Navbar/>
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Terms and Conditions</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="font-semibold text-base">1. Ownership of Content</h2>
          <p>
            All course materials, videos, worksheets, and resources are the intellectual property of
            Sign Natural Academy and may not be copied, redistributed, or used for commercial
            purposes without written consent.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base">2. Respectful Participation</h2>
          <p>
            We promote a respectful and inclusive learning environment. Disruptive, offensive, or
            disrespectful behaviour during live sessions (online or in-person) may lead to removal
            from the session without a refund.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base">3. Use of Personal Data</h2>
          <p>
            We collect limited information to facilitate registration and communication. Your data
            is stored securely and never shared with third parties without your consent.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base">4. Health Disclaimer</h2>
          <p>
            Our skincare trainings are for educational purposes only. Participants are responsible
            for checking ingredient allergies or sensitivities before using any formulation made
            during the workshops.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base">5. Age Requirement</h2>
          <p>
            Participants under 18 must be accompanied by a guardian unless the session is designed
            specifically for children.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base">6. Changes to Schedule or Content</h2>
          <p>
            We reserve the right to reschedule or make adjustments to course content, instructors,
            or workshop structure. In such cases, we’ll communicate in advance and offer
            alternatives where possible.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base">7. Limitation of Liability</h2>
          <p>
            Sign Natural Academy is not liable for any damages, losses, or injuries resulting from
            the misuse of information or products created during our workshops or from our content.
          </p>
        </div>
      </div>
      
    </div>
  
    </div>
  );
}
