import React from "react";
import { useAuth } from "login/context/AuthContext"; // Import useAuth from where you've defined it
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{ children: any }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};
