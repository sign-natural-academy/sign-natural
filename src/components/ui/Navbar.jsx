// src/components/ui/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { isAuthed, getUser, signOut } from "../../lib/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false); // Mobile nav
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed] = useState(isAuthed());
  const [user, setUser] = useState(getUser());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const firstName = user?.name?.split(" ")[0] || "User";
  const role = user?.role || "user";

  // 🧭 Define roles and dashboard paths
  const isAdmin = role === "admin";
  const isSuperuser = role === "superuser";
  const isAdminish = isAdmin || isSuperuser;

  const roleLabel = isSuperuser
    ? "Superuser"
    : isAdmin
    ? "Admin"
    : "User";

  const dashboardPath =
    isSuperuser
      ? "/super-dashboard"
      : isAdmin
      ? "/admin-dashboard"
      : "/user-dashboard";

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Scroll background effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep auth state in sync across tabs
  useEffect(() => {
    const onStorage = () => {
      setAuthed(isAuthed());
      setUser(getUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Close user menu on outside click / Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setUserMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    signOut();
    setAuthed(false);
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 flex items-center justify-between ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo2.png" alt="Sign Natural" className="h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 text-gray-900 font-medium">
          <Link to="/">Home</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/workshop">Workshops</Link>
          <a
            href="https://signnatural.keepup.store/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Products
          </a>
          <Link to="/about">About</Link>
          <Link to="/stories">Stories</Link>

          {!authed ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#455f30] text-white px-4 py-2 rounded hover:bg-green-900"
              >
                Sign Up
              </Link>
            </>
          ) : (
            // User dropdown
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 focus:outline-none"
              >
                <UserCircleIcon className="w-7 h-7 text-[#455f30]" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium text-gray-800">
                    {firstName}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                      isAdminish
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {roleLabel}
                  </span>
                </div>
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 flex flex-col bg-white shadow-xl rounded-lg w-52 border overflow-hidden py-2"
                >
                  <Link
                    to={dashboardPath}
                    role="menuitem"
                    className="px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    role="menuitem"
                    className="px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-2xl p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          <Link to="/" className="block py-2">
            Home
          </Link>
          <Link to="/learn" className="block py-2">
            Learn
          </Link>
          <Link to="/workshop" className="block py-2">
            Workshops
          </Link>
          <a
            href="https://signnatural.keepup.store/"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2"
          >
            Products
          </a>
          <Link to="/about" className="block py-2">
            About
          </Link>
          <Link to="/stories" className="block py-2">
            Stories
          </Link>

          {!authed ? (
            <>
              <Link to="/login" className="block py-2">
                Login
              </Link>
              <Link
                to="/signup"
                className="block py-2 bg-[#455f30] text-white text-center rounded"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 py-2 border-b border-gray-200 mb-2">
                <UserCircleIcon className="w-7 h-7 text-[#455f30]" />
                <div>
                  <div className="text-sm font-medium">{firstName}</div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                      isAdminish
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {roleLabel}
                  </span>
                </div>
              </div>
              <Link to={dashboardPath} className="block py-2">
                Dashboard
              </Link>
              <Link to="/profile" className="block py-2">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
