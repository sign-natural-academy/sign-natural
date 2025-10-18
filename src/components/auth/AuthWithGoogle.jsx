// src/components/auth/AuthWithGoogle.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../api/services/auth";
import { signIn } from "../../lib/auth";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function AuthWithGoogle({ className = "" }) {
  const btnRef = useRef(null);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // basic guards
    if (!CLIENT_ID) {
      setErr("Missing VITE_GOOGLE_CLIENT_ID");
      return;
    }

    // poll for the GIS script
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCredentialResponse,
            ux_mode: "popup", // popup (no redirect)
            auto_select: false,
          });

          if (btnRef.current) {
            window.google.accounts.id.renderButton(btnRef.current, {
              theme: "outline",
              size: "large",
              text: "continue_with",
              shape: "pill",
              width: 320,
            });
          }

          // optional one-tap prompt (can be commented out if undesired)
          // window.google.accounts.id.prompt();

          setReady(true);
          clearInterval(timer);
        } catch (e) {
          setErr("Failed to initialize Google Sign-In");
          clearInterval(timer);
        }
      }
      if (attempts > 50) {
        setErr("Google script not loaded");
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleCredentialResponse = async (resp) => {
    try {
      const credential = resp?.credential;
      if (!credential) throw new Error("No Google credential returned");

      const { data } = await googleLogin(credential);
      const { token, user } = data || {};
      if (!token || !user) throw new Error("Invalid server response");

      // Persist + redirect with your existing helpers
      signIn(token, user);
      navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e.message ||
          "Google sign-in failed. Please try again."
      );
    }
  };

  return (
    <div className={`mt-6 ${className}`}>
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-500">or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex items-center justify-center">
        <div ref={btnRef} />
      </div>

      {!ready && !err && (
        <div className="text-center text-xs text-gray-500 mt-2">
          Preparing Google…
        </div>
      )}
      {err && (
        <div className="text-center text-xs text-red-600 mt-2">{err}</div>
      )}
    </div>
  );
}
