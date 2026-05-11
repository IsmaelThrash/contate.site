import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requireSlug = true }) => {
  const { isAuthenticated, currentUser, session } = useAuth();
  const location = useLocation();

  // Se session is loaded but user is not authenticated
  // Wait, in AuthContext, we don't have a specific initialLoading flag anymore, but if it was rendering this component, loading is false.
  // Actually, AuthContext doesn't render children until loading is false.

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is authenticated but doesn't have a slug (incomplete profile)
  // and they are trying to access a protected route that requires a slug (like Dashboard)
  if (requireSlug && (!currentUser || !currentUser.slug)) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
