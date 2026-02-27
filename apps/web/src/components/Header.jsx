
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Link2, LogOut, LayoutDashboard, Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
              contate.site
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/">
                  <Button variant="ghost" className="gap-2 font-semibold">
                    <Home className="h-4 w-4" />
                    Início
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="font-semibold">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="shadow-primary/25">
                    Cadastrar
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/">
                  <Button variant="ghost" className="gap-2 font-semibold">
                    <Home className="h-4 w-4" />
                    Início
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" className="gap-2 font-semibold">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="gap-2 hover:bg-destructive hover:text-white hover:border-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className="w-full">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Home className="h-5 w-5" /> Início
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <LogOut className="h-5 w-5" /> Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full justify-start gap-3">
                      <Link2 className="h-5 w-5" /> Cadastrar
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/" className="w-full">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Home className="h-5 w-5" /> Início
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="w-full">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 text-destructive hover:bg-destructive hover:text-white"
                  >
                    <LogOut className="h-5 w-5" /> Sair
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
