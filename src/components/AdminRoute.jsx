import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GlobalLoader from "./GlobalLoader";

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <GlobalLoader />;
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
