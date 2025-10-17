// src/components/pages/TermsAndConditions.jsx

import React from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";



export default function TermsAndConditions() {
  
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#faf8f6] pt-24 py-12 px-6 md:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[#4b2e20] mb-6">
          Terms and Conditions
        </h1>
        <p className="text-gray-700 mb-4">
          Welcome to Sign Natural. By accessing or using our website, you agree
          to be bound by these Terms and Conditions. Please read them carefully.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          Use of Services
        </h2>
        <p className="text-gray-700 mb-4">
          You agree to use our services only for lawful purposes and in
          accordance with these Terms. You must not use our website in any way
          that may cause damage to the site or impair the availability of access
          to it.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          Intellectual Property
        </h2>
        <p className="text-gray-700 mb-4">
          All content on this site, including text, images, logos, and graphics,
          is the property of Sign Natural and is protected by copyright and
          other intellectual property laws.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          Limitation of Liability
        </h2>
        <p className="text-gray-700 mb-4">
          Sign Natural will not be liable for any damages arising from the use
          of our website or services.
        </p>
        <p className="text-gray-700">
          If you do not agree with these Terms and Conditions, please do not use
          our website or services.
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}
