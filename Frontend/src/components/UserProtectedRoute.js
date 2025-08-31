import React from 'react';
import { Navigate } from 'react-router-dom';

function isUser() {
  // Only true if logged in and not admin
  return localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('isAdmin') !== 'true';
}

const UserProtectedRoute = ({ children }) => {
  if (!isUser()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default UserProtectedRoute;
