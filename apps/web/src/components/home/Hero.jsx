import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, LayoutDashboard, ExternalLink } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getAvatarUrl } from '@/lib/utils.js';
import { InteractiveHeroMockup } from './InteractiveHeroMockup.jsx';

export const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [handle, setHandle] = useState('');
  const [activeTab, setActiveTab] = useState('beleza');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const profileKeys = ['beleza', 'pet', 'saude', 'criador'];

  // Carrossel com rotação automática a cada 3.5s (Regra Obrigatória AGENTS.md)
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const nextIdx = (profileKeys.indexOf(prev) + 1) % profileKeys.length;
        return profileKeys[nextIdx];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    setIsAutoRotating(false); // Pausa ao clique manual do usuário
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    const cleanSlug = handle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanSlug) {
      navigate(`/login?claim=${encodeURIComponent(cleanSlug)}`);
    } else {
      navigate('/login');
    }
  };

  const currentProfile = homeContent.profiles[activeTab];
  const userAvatar = getAvatarUrl(currentUser?.avatar, currentUser?.email);
  const userInitial = (currentUser?.nome || currentUser?.email || 'U').charAt(0).toUpperCase();

  return (
    <section 
      aria-labelledby="hero-heading"
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible z-10"
    >
      {/* Luz Ambiente de Fundo Calibrada */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-blue-600/[0.08] dark:bg-blue-500/[0.12] rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-8 xl:gap-10">
        {/* Coluna Esquerda: Headline Imutável (Opção 1) & Reserva de Slug */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start w-full z-10">
          
          {/* Badge Oficial */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide shadow-sm mb-6 backdrop-blur-sm"
          >
            <Sparkles size={15} className="text-blue-600 dark:text-blue-400" />
            <span>{homeContent.hero.badge}</span>
          </motion.div>

          {/* H1 Principal com Palavras-Chave de Alto Volume de Busca */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.14] tracking-tight mb-6 font-['Sora']"
          >
            {homeContent.hero.titleLine1} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#3B82F6] to-[#38BDF8]">
              {homeContent.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtítulo Universal & Completo */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal mb-8 max-w-xl lg:max-w-2xl leading-relaxed"
          >
            {homeContent.hero.subtitle}
          </motion.p>

          {/* Caixa de Reserva ou Painel para Usuário Logado */}
          {isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full bg-white dark:bg-slate-900/95 p-4 sm:p-5 rounded-3xl border border-blue-500/30 dark:border-blue-500/30 shadow-xl shadow-blue-500/5 dark:shadow-indigo-950/30 backdrop-blur-sm text-left"
            >
              <div className="flex items-center gap-3.5 pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Você já está conectado
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    Olá, {currentUser?.nome || 'Usuário'}!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.slug ? (
                      <span>Seu link ativo: <strong className="text-blue-600 dark:text-blue-400 font-semibold">contate.site/{currentUser.slug}</strong></span>
                    ) : (
                      currentUser?.email
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 border border-blue-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 text-sm sm:text-base hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
                >
                  <LayoutDashboard size={18} />
                  <span>Acessar Meu Painel</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {currentUser?.slug && (
                  <button
                    onClick={() => navigate(`/${currentUser.slug}`)}
                    className="shrink-0 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    title="Ver página ao vivo"
                  >
                    <ExternalLink size={16} />
                    <span>Ver Minha Página</span>
                  </button>
                )}
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 gap-2">
                <span className="inline-flex items-center gap-1 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400" />
                  Pronto para editar links, cores e métricas
                </span>
                <button
                  onClick={logout}
                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium underline underline-offset-2 cursor-pointer"
                >
                  Alternar conta
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full bg-white dark:bg-slate-900/95 p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-indigo-950/20 backdrop-blur-sm"
            >
              <form onSubmit={handleReservationSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center px-4 py-3.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <span className="text-slate-400 dark:text-slate-500 font-semibold text-sm sm:text-base select-none shrink-0">
                    {homeContent.hero.reservationPrefix}
                  </span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder={homeContent.hero.reservationPlaceholder}
                    className="bg-transparent border-none focus:outline-none flex-1 min-w-0 ml-1.5 text-slate-900 dark:text-white font-bold text-sm sm:text-base placeholder:text-slate-400"
                  />
                </div>
                
                {/* Botão de Alta Autoridade Cobalto Tech */}
                <button
                  type="submit"
                  className="shrink-0 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 border border-blue-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <span>{homeContent.hero.ctaButton}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Microcopy de Garantias e Vantagens */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1 gap-2">
                {homeContent.hero.guarantees.map((guarantee, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 font-medium">
                    <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400" />
                    {guarantee}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Coluna Direita: Mockup 3D Tilt sem cards externos */}
        <InteractiveHeroMockup
          currentProfile={currentProfile}
          activeTab={activeTab}
          profileKeys={profileKeys}
          onTabSelect={handleTabSelect}
        />
      </div>
    </section>
  );
};
