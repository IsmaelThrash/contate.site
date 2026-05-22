
import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { ThemeProvider } from '@/contexts/ThemeProvider.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import OnboardingPage from '@/pages/OnboardingPage.jsx';
import AdminPage from '@/pages/AdminPage.jsx';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="contate-site-theme">
        <AuthProvider>
          <ScrollToTop />
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute requireSlug={false}>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/:slug" element={<ProfilePage />} />
          </Routes>
          <Toaster />
        </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
