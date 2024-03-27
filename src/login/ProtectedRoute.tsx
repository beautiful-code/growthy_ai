import React from "react";
import { useAuth } from "./AuthContext"; // Import useAuth from where you've defined it
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{ children: any }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  console.log({ isAuthenticated });

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};
