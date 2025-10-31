import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed, getUserRole } from "../lib/auth";

export default function RequireSuperuser({ children }) {
  const location = useLocation();
  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (getUserRole() !== "superuser") {
    return <Navigate to="/user-dashboard" replace />;
  }
  return children;
}
