import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 py-7 shadow-md relative z-10 bg-shea-light">
       <div className="flex justify-center mb-6">
        <Link to="/">
          <img src="/logo2.png" alt="Logo" className="h-20 w-auto" />
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6 text-gray-900 font-medium">
        <a href="/">Home</a>
        <Link to="/learn">
  Learn
</Link>
        <a href="#">Workshops</a>
        <a href="#">Products</a>
        <a href="#" >About us </a>
        <a href="#">Stories</a>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-[#455f30] text-white px-4 py-2 rounded hover:bg-green-900"
        >
          Sign Up
        </Link>
      </div>

      {/* Desktop CTA */}
      <button className="hidden md:block bg-[#E1AD01] text-gray px-4 py-2 rounded">
        Book a Class
      </button>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-900 text-2xl w-3 h-3 sm:w-4 sm:h-4 focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 z-50 flex flex-col gap-4 text-gray-900 font-medium md:hidden">
          <a href="/">Home</a>
          <a href="#">Learn</a>
          <a href="#">Workshops</a>
          <a href="#">Products</a>
          <a href="#">About</a>
          <a href="#">Stories</a>
          <Link to="/login">Login </Link>
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
