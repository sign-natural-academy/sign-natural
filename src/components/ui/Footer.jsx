//src/components/ui/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#455f30] text-gray-200 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-serif mb-4">Sign Natural Academy</h3>
            <p className="text-sm">Learning & experiences rooted in tradition, sustainability, and community.</p>
          </div>

          <div>
            <h4 className="text-sm font-serif mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/learn">Learn</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/stories">Success Stories</Link></li>
              <li><Link to="/about">About us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-serif mb-4">Policy</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-serif mb-4">Contact Us</h4>
            <p className="mb-2 text-sm">Accra, Ghana</p>
            <p className="mb-2 text-sm">hello@signnatural.com</p>
            <p className="mb-4 text-sm">+233 059 632 4605</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/signnatural" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>
              <a href="https://www.instagram.com/signnatural" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
              <a href="https://www.twitter.com/signnatural" target="_blank" rel="noopener noreferrer" aria-label="X">X</a>
              <a href="https://www.tiktok.com/@signnatural" target="_blank" rel="noopener noreferrer" aria-label="Tiktok">TT</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-white/20 text-center">
          <p className="text-sm">{`© ${new Date().getFullYear()} Sign Natural. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}
