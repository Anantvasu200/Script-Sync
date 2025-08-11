import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ currentUser, children }) => {
  if (!currentUser) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  // Logged in, allow access
  return children;
};

export default ProtectedRoute;
