import React from "react";
import Navbar from "./Navbar";
import { Footer } from "./Footer";

export default function PrivacyPolicy() {
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
     
<h2 className="text-2xl font-bold mb-6 text-green-900">Privacy Policy</h2>
     
      <p className="mb-4">
        At <strong>Sign Natural Academy</strong>, your privacy is important to us.
        This Privacy Policy explains how we collect, use, and protect your personal data when you use our services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2 text-green-800">What We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Location</li>
      </ul>
      <p className="mb-4">
        This information is collected solely to process course registrations, send updates, and improve your learning experience.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2 text-green-800">What We Do With Your Data</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Confirm and manage workshop registrations</li>
        <li>Provide access to paid and free resources</li>
        <li>Notify you about updates, new courses, and events</li>
        <li>Improve our website and services</li>
      </ul>
      <p className="mb-4">
        We store your data securely and do not share it with third-party marketers or advertisers.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2 text-green-800">What We Don't Do</h2>
      <ul className="list-disc list-inside mb-4 text-red-700">
        <li>Store payment information on our servers</li>
        <li>Share your data with third-party advertisers</li>
        <li>Send spam (every email includes an unsubscribe option)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2 text-green-800">Your Consent & Control</h2>
      <p className="mb-4">
        By registering for any of our services, you agree to this Privacy Policy. You may request the deletion of your data at any time by emailing us at:
      </p>
      <p className="font-medium text-green-900 mb-4">hello@signnatural.com</p>
      <p>
        We are committed to collecting only what’s needed to serve you better — and keeping your information private, always.
      </p>
    </div>
 
    </div>
  );
}
