// src/components/auth/AuthWithGoogle.jsx
import React, { useEffect, useRef } from "react";
import { useGoogleButton } from "../../hooks/useGoogleButton";

export default function AuthWithGoogle() {
  const btnRef = useRef(null);
  const { ready, loading, error, renderButton } = useGoogleButton();

  useEffect(() => {
    if (ready && btnRef.current) {
      renderButton(btnRef.current, { width: 100});
    }
  }, [ready, renderButton]);

  return (
    <div className="mt-6 text-center">
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-500">or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div ref={btnRef} />

      {loading && <p className="text-xs text-gray-400 mt-2">Signing in…</p>}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
