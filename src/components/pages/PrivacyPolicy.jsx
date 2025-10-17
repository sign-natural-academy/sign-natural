// src/components/pages/PrivacyPolicy.jsx

import React from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function PrivacyPolicy() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#faf8f6] pt-24 py-12 px-6 md:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[#4b2e20] mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-700 mb-4">
          At Sign Natural, we are committed to protecting your personal
          information and your right to privacy. This Privacy Policy explains
          what information we collect, how we use it, and your rights regarding
          it.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          Information We Collect
        </h2>
        <p className="text-gray-700 mb-4">
          We may collect personal information such as your name, email address,
          and usage data when you use our website or services.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          How We Use Your Information
        </h2>
        <p className="text-gray-700 mb-4">
          We use the information we collect to provide, maintain, and improve
          our services, communicate with you, and comply with legal obligations.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          Your Rights
        </h2>
        <p className="text-gray-700 mb-4">
          You have the right to access, update, or delete the personal
          information we hold about you. You may also opt out of marketing
          communications at any time.
        </p>
        <p className="text-gray-700">
          If you have questions about this Privacy Policy, please contact us
          through our website.
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}