import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { supabase } from '@/lib/supabaseClient.js';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requireSlug = true, requireAdmin = false }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  const [adminChecked, setAdminChecked] = useState(!requireAdmin);
  const [isAdminValid, setIsAdminValid] = useState(currentUser?.is_admin || false);

  useEffect(() => {
    let isMounted = true;
    if (requireAdmin && isAuthenticated && currentUser) {
      supabase.rpc('is_admin')
        .then(({ data, error }) => {
          if (isMounted) {
            if (!error && typeof data === 'boolean') {
              setIsAdminValid(data);
            } else {
              setIsAdminValid(!!currentUser.is_admin);
            }
            setAdminChecked(true);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsAdminValid(!!currentUser.is_admin);
            setAdminChecked(true);
          }
        });
    } else {
      setAdminChecked(true);
    }
    return () => { isMounted = false; };
  }, [requireAdmin, isAuthenticated, currentUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is authenticated but doesn't have a slug (incomplete profile)
  // and they are trying to access a protected route that requires a slug (like Dashboard)
  if (requireSlug && (!currentUser || !currentUser.slug)) {
    return <Navigate to="/onboarding" replace />;
  }

  // Admin route protection: verify admin privilege via server RPC
  if (requireAdmin) {
    if (!adminChecked) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      );
    }
    if (!isAdminValid) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

