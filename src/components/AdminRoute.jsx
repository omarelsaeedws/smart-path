import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <span className="ml-3 text-white font-bold text-xl">جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
