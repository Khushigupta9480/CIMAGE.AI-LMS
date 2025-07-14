// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // in seconds

    // ✅ Expiry check
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }

    // ✅ Role match check
    if (payload.role !== role) return <Navigate to="/login" />;

    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
