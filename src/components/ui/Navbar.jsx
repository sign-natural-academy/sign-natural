import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"}`}>
      <div className={`max-w-7xl mx-auto px-4 flex items-center justify-between ${scrolled ? "py-3" : "py-5"}`}>
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo2.png" alt="Sign Natural" className="h-12 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-gray-900 font-medium">
          <Link to="/">Home</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/workshop">Workshops</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/stories">Stories</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="bg-[#455f30] text-white px-4 py-2 rounded">Sign Up</Link>
        </div>

        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl p-1">
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          <Link to="/" className="block py-2">Home</Link>
          <Link to="/learn" className="block py-2">Learn</Link>
          <Link to="/workshop" className="block py-2">Workshops</Link>
          <Link to="/products" className="block py-2">Products</Link>
          <Link to="/about" className="block py-2">About</Link>
          <Link to="/stories" className="block py-2">Stories</Link>
          <Link to="/login" className="block py-2">Login</Link>
          <Link to="/signup" className="block py-2 bg-[#455f30] text-white text-center rounded">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}
