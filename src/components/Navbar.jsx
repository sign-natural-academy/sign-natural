import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0  left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/0 lg:bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-white shadow-md"
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 ${
          scrolled ? "py-3" : "py-6 lg:py-7"
        } transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src="/logo2.png" alt="Logo" className="h-14 w-auto transition-all duration-300" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 text-gray-900 font-medium">
          <a href="/">Home</a>
          <Link to="/learn">Learn</Link>
          <Link to="/workshop">Workshop</Link>
          <a href="#">Products</a>
          <Link to="/About us">About us</Link>
          <Link to="/Stories">Stories</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link
            to="/signup"
            className="bg-[#455f30] text-white px-4 py-2 rounded hover:bg-green-900"
          >
            Sign Up
          </Link>
        </div>

        {/* Desktop CTA */}
        <button className="hidden lg:block bg-[#E1AD01] text-black px-4 py-2 rounded">
          Book a Class
        </button>

        {/* Hamburger Icon */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-900 text-2xl w-6 h-6 focus:outline-none"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="w-full bg-white shadow-md py-4 px-6 z-50 flex flex-col gap-4 text-gray-900 font-medium lg:hidden">
          <Link to="/">Home</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/workshop">Workshop</Link>
          <a href="#">Products</a>
          <Link to="/About us">About us</Link>
          <Link to="/Stories">Stories</Link>
          <Link to="/login">Login</Link>
          <Link
            to="/signup"
            className="bg-[#455f30] text-white px-4 py-2 rounded text-center"
          >
            Sign Up
          </Link>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded w-max">
            Book a Class
          </button>
        </div>
      )}
    </nav>
  );
}
