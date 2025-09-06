import React from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function RefundPolicy() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#faf8f6] pt-24 py-12 px-6 md:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[#4b2e20] mb-6">
          Refund Policy
        </h1>
        <p className="text-gray-700 mb-4">
          At Sign Natural, we strive to provide the best services possible. If
          you are not satisfied with your purchase, we are here to help.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          Eligibility for Refunds
        </h2>
        <p className="text-gray-700 mb-4">
          You may be eligible for a refund if the service was not delivered as
          promised or if there was a technical issue preventing you from
          accessing the content.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          Refund Process
        </h2>
        <p className="text-gray-700 mb-4">
          To request a refund, please contact our support team within 7 days of
          your purchase. We will review your request and notify you of the
          outcome within 5 business days.
        </p>
        <h2 className="text-xl font-semibold text-[#4b2e20] mt-6 mb-2">
          Exceptions
        </h2>
        <p className="text-gray-700 mb-4">
          Refunds may not be available for services already rendered or for
          products that are delivered instantly (such as digital downloads).
        </p>
        <p className="text-gray-700">
          For more information, please contact us through our website.
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}