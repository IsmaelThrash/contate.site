
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import HomePage from '@/pages/HomePage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/:slug" element={<ProfilePage />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
