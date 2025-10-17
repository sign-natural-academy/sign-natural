// src/components/RequireAdmin.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed, isAdminRole } from "../lib/auth";

export default function RequireAdmin({ children }) {
  const location = useLocation();
  if (!isAuthed()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!isAdminRole()) {
    return <Navigate to="/user-dashboard" state={{ from: location }} replace />;
  }
  return children;
}
