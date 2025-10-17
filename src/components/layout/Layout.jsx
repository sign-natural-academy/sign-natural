//src/layout/Layout.jsx
import React from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
