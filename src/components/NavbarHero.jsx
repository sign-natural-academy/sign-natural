
import { useState } from "react";

export default function NavbarHero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // <div className="min-h-screen flex flex-col bg-white">
    <div className="w-full min-h-screen flex flex-col bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-7 shadow-md relative z-10 bg-white">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-green-900 font-medium">
          <a href="#">Home</a>
          <a href="#">Learn</a>
          <a href="#">Workshops</a>
          <a href="#">Products</a>
          <a href="#">Stories</a>
        </div>

        <button className="hidden md:block bg-yellow-600 text-white px-4 py-2 rounded">
          Book a Class
        </button>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-green-900 text-2xl focus:outline-none"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 z-50 flex flex-col gap-4 text-green-900 font-medium md:hidden">
            <a href="#">Home</a>
            <a href="#">Learn</a>
            <a href="#">Workshops</a>
            <a href="#">Products</a>
            <a href="#">Stories</a>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded w-max">
              Book a Class
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 bg-green-900 text-white px-6 py-10 md:flex md:items-center md:justify-between">
        {/* Left */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-5xl font-light leading-snug">
            Learn the Art of Organic Skincare with <br />
            <strong className="font-semibold">SIGN NATURAL</strong>
          </h1>
          <p className="text-lg leading-relaxed">
            Discover authentic Ghanaian ingredients and techniques through hands-on workshops,
            online masterclasses, and experiential learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-600 px-6 py-3 rounded text-black font-medium">
              Explore Classes
            </button>
            <button className="bg-white text-black px-6 py-3 rounded border border-white">
              Book an Experience
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="/organic.jpg"
            alt="Organic Products"
            className="rounded-xl w-full max-w-xl mx-auto"
          />
        </div>
      </section>
    </div>
    
  );
}
