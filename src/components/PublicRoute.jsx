import React from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentUser && currentUser.emailVerified) {
    if (userProfile?.profileCompleted) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default PublicRoute;
