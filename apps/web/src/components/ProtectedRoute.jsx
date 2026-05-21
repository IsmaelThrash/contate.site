import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requireSlug = true, requireAdmin = false }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is authenticated but doesn't have a slug (incomplete profile)
  // and they are trying to access a protected route that requires a slug (like Dashboard)
  if (requireSlug && (!currentUser || !currentUser.slug)) {
    return <Navigate to="/onboarding" replace />;
  }

  // Admin route protection: redirect non-admin users to /dashboard
  if (requireAdmin && (!currentUser || !currentUser.is_admin)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
