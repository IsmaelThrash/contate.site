import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';
import { InteractiveHeroMockup } from './InteractiveHeroMockup.jsx';

export const Hero = () => {
  const navigate = useNavigate();
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

  return (
    <section 
      aria-labelledby="hero-heading"
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible z-10"
    >
      {/* Luz Ambiente de Fundo */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[380px] bg-gradient-to-tr from-indigo-600/15 via-blue-600/10 to-sky-400/15 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-8 xl:gap-10">
        {/* Coluna Esquerda: Headline Imutável (Opção 1) & Reserva de Slug */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start w-full z-10">
          
          {/* Badge Oficial */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide shadow-sm mb-6 backdrop-blur-sm"
          >
            <Sparkles size={15} className="text-indigo-600 dark:text-indigo-400" />
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

          {/* Caixa de Reserva de Endereço - Preenchendo até perto do celular */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full bg-white dark:bg-slate-900/95 p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-indigo-950/20 backdrop-blur-sm"
          >
            <form onSubmit={handleReservationSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center px-4 py-3.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
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
              
              {/* Botão com Efeito Shimmer Metálico e Feedback Háptico */}
              <button
                type="submit"
                className="shrink-0 relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] group"
              >
                {/* Linha de Brilho Metálico Passante */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
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
