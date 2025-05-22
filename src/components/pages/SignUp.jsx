import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function OAuthButton({provider}){
    const icon = {
        Google:"/google-icon.svg",
        LinkedIn:"/linkedin-icon.svg",
        Facebook:"/facebook-icon.svg",
    };

    return (
        <button className="flex-1 border border-gray-300 rounded py-2 flex justify-center items-center hover:bg-gray-100 transition">
      <img src={icon[provider]} alt={provider} className="h-5 w-5 mr-2" />
      <span className="text-sm">{provider}</span>
    </button>

    );
}

export default function SignUp(){
    return(
      <>
        <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Image */}
      <motion.div 
       initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}className="hidden md:flex w-1/2 bg-[#faf8f6*] items-center justify-center">
        <img
          src="/woman2.jpg"
          alt="Sign Naturals"
          className="object-cover h-full"
        />
      </motion.div>

      {/* Right Form */}
      <motion.div
       initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
             className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
  <Link to="/">
    <img src="/logo2.png" alt="Logo" className="h-20 w-auto" />
  </Link>
</div>
          <h2 className="text-2xl font-bold text-[#455f30] mb-6">SIGN UP</h2>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              type="text"
              placeholder="First name"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              type="password"
              placeholder="Repeat Password"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
            />

            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" id="terms" className="accent-green-700" />
              <label htmlFor="terms">
                I agree to the <a href="#" className="underline">Terms of Use</a>
              </label>
            </div>

            <button className="w-full bg-[#455f30] text-white py-2 rounded hover:bg-green-900">
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">Or sign up with</div>

          <div className="flex justify-between mt-4 space-x-4">
            <OAuthButton provider="Google" />
            <OAuthButton provider="LinkedIn" />
            <OAuthButton provider="Facebook" />
          </div>
         <div className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
         <Link to="/login" className="text-green-700 hover:underline font-medium">
         Log in
         </Link>
         </div>
        </div>
      </motion.div>
    </div>
    </>
    );
}