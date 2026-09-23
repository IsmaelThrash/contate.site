import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle.jsx';
import { homeContent } from '@/lib/homeContent.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getAvatarUrl } from '@/lib/utils.js';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  const userAvatar = getAvatarUrl(currentUser?.avatar, currentUser?.email);
  const userInitial = (currentUser?.nome || currentUser?.email || 'U').charAt(0).toUpperCase();
  const userDisplayName = currentUser?.nome?.split(' ')[0] || currentUser?.slug || 'Meu Perfil';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm'
          : 'bg-white/60 dark:bg-[#121212]/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F46E5] via-[#2563EB] to-[#38BDF8] p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center p-1.5">
              <img src="/favicon.svg" alt="contate.site" className="w-full h-full" />
            </div>
          </div>
          <span className="font-sora font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            contate<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#38BDF8]">.site</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {homeContent.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-indigo-500 dark:hover:text-white transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {currentUser?.slug && (
                <button
                  onClick={() => navigate(`/${currentUser.slug}`)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/60 rounded-xl transition-all cursor-pointer"
                  title={`Ver página contate.site/${currentUser.slug}`}
                >
                  <ExternalLink size={14} className="text-slate-500 dark:text-slate-400" />
                  <span>Ver Minha Página</span>
                </button>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2.5 pl-2 pr-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 border border-blue-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Acessar o Painel de Controle"
              >
                <div className="w-6 h-6 rounded-md overflow-hidden bg-white/20 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <span>Meu Painel</span>
                <ArrowRight size={14} className="opacity-80" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-500 dark:hover:text-white px-4 py-2 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800 cursor-pointer"
              >
                {homeContent.nav.loginText}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 border border-blue-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{homeContent.nav.ctaText}</span>
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            aria-label="Abrir menu de navegação"
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 flex flex-col gap-4 shadow-xl overflow-hidden"
          >
            <nav className="flex flex-col gap-1">
              {homeContent.nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 mb-1">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                      {userAvatar ? (
                        <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {currentUser?.nome || 'Usuário Conectado'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {currentUser?.slug ? `contate.site/${currentUser.slug}` : currentUser?.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 border border-blue-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    <span>Acessar Meu Painel</span>
                    <ArrowRight size={16} />
                  </button>

                  {currentUser?.slug && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate(`/${currentUser.slug}`);
                      }}
                      className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={14} />
                      <span>Ver Minha Página Pública</span>
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="w-full py-2 text-xs font-medium text-red-500 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={13} />
                    <span>Sair da conta</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-center py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    {homeContent.nav.loginText}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-center py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 border border-blue-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{homeContent.nav.ctaText}</span>
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
