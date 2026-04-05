import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Not logged in → go to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Email not verified → verify first
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Onboarding gate: if user hasn't completed onboarding, redirect
  // (but don't redirect if they're already on /onboarding)
  if (
    userProfile &&
    userProfile.role !== "admin" &&
    (userProfile.isOnboarded === false && !userProfile.onboardingCompleted) &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
