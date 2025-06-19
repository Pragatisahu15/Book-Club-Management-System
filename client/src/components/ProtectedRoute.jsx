import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    toast.error("Please login first");
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.error("Unauthorized access");
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
