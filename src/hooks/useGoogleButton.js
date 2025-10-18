// src/hooks/useGoogleButton.js
import { useEffect, useState, useCallback } from "react";
import { googleLogin } from "../api/services/auth";
import { signIn } from "../lib/auth";
import { useNavigate } from "react-router-dom";

/**
 * useGoogleButton Hook
 * Handles Google Identity button initialization, click flow, and state.
 *
 * @param {Object} options
 * @param {string} options.clientId - Google OAuth Client ID (from .env)
 * @param {Function} [options.onSuccess] - optional callback after login success
 * @param {Function} [options.onError] - optional callback on error
 * @returns {Object} { ready, loading, error, renderButton }
 */
export function useGoogleButton({
  clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID,
  onSuccess,
  onError,
} = {}) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // -- handle Google response --
  const handleCredentialResponse = useCallback(
    async (resp) => {
      setLoading(true);
      try {
        const credential = resp?.credential;
        if (!credential) throw new Error("No Google credential received");

        const { data } = await googleLogin(credential);
        const { token, user } = data || {};
        if (!token || !user) throw new Error("Invalid response from server");

        signIn(token, user);
        onSuccess?.(user);
        navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Google sign-in failed";
        setError(message);
        onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError, navigate]
  );

  // -- initialize button rendering function --
  const renderButton = useCallback(
    (element, options = {}) => {
      if (!window.google?.accounts?.id || !element) return;
      window.google.accounts.id.renderButton(element, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 320,
        ...options,
      });
    },
    []
  );

  // -- initialize Google Identity on mount --
  useEffect(() => {
    if (!clientId) {
      setError("Missing VITE_GOOGLE_CLIENT_ID");
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });
      setReady(true);
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            ux_mode: "popup",
          });
          setReady(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [clientId, handleCredentialResponse]);

  return { ready, loading, error, renderButton };
}

export default useGoogleButton;
