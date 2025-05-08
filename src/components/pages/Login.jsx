import React from "react";
import { Link } from "react-router-dom";

function OAuthButton({ provider }) {
  const icon = {
    Google: "/google-icon.svg",
    LinkedIn: "/linkedin-icon.svg",
    Facebook: "/facebook-icon.svg",
  };

  return (
    <button className="flex-1 border border-gray-300 rounded py-2 flex justify-center items-center hover:bg-gray-100 transition">
      <img src={icon[provider]} alt={provider} className="h-5 w-5 mr-2" />
      <span className="text-sm">{provider}</span>
    </button>
  );
}

export default function Login() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 bg-[#faf8f6*] items-center justify-center">
        <img
          src="/woman.jpg"
          alt="Sign Natural"
          className="object-cover h-full"
        />
      </div>

      {/* Right Form */}

      
      
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
      <div className="flex items-center gap-2">
      </div>
        <div className="max-w-md w-full">
             {/* Logo */}
             <div className="flex justify-center mb-6">
  <Link to="/">
    <img src="/logo2.png" alt="Logo" className="h-20 w-auto" />
  </Link>
</div>
          <h2 className="text-2xl font-bold text-[#455f30] mb-6">LOGIN</h2>
         
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <button className="w-full bg-[#455f30] text-white py-2 rounded hover:bg-green-900">
              Log In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">Or log in with</div>

          <div className="flex justify-between mt-4 space-x-4">
            <OAuthButton provider="Google" />
            <OAuthButton provider="LinkedIn" />
            <OAuthButton provider="Facebook" />
          </div>
        </div>
      </div>
    </div>
  );
}
