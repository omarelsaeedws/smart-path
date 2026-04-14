import React from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import GlobalLoader from "./GlobalLoader";

const PublicRoute = ({ children }) => {
  // ------------------------------------------------------------------------
  // Auth State
  // ------------------------------------------------------------------------
  const { currentUser, userProfile, loading } = useAuth();

  // ------------------------------------------------------------------------
  // Render Logic
  // ------------------------------------------------------------------------
  if (currentUser && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (loading && currentUser && currentUser.emailVerified) {
    return <GlobalLoader />;
  }

  if (currentUser && currentUser.emailVerified) {
    if (userProfile?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (userProfile?.isOnboarded || userProfile?.profileCompleted || userProfile?.onboardingCompleted) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default PublicRoute;
