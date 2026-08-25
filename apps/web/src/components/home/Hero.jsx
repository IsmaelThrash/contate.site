import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, ChevronRight, MessageCircle, 
  Play, Sparkles, MapPin, Scissors, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

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
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Luz ambiente decorativa e sutil */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-violet-400/15 via-indigo-300/10 to-cyan-300/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
        {/* Coluna Esquerda: Headline & Reserva de Slug */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start w-full z-10">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/60 border border-violet-200/80 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide shadow-sm mb-6"
          >
            <Sparkles size={15} className="text-violet-600 dark:text-violet-400" />
            <span>{homeContent.hero.badge}</span>
          </motion.div>

          {/* H1 Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.14] tracking-tight mb-6"
          >
            {homeContent.hero.titleLine1} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-400">
              {homeContent.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal mb-8 max-w-xl leading-relaxed"
          >
            {homeContent.hero.subtitle}
          </motion.p>

          {/* Caixa de Reserva de Endereço */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900/90 p-3 sm:p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-violet-950/20"
          >
            <form onSubmit={handleReservationSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center px-4 py-3.5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                <span className="text-slate-400 dark:text-slate-500 font-semibold text-sm sm:text-base select-none">
                  {homeContent.hero.reservationPrefix}
                </span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder={homeContent.hero.reservationPlaceholder}
                  className="bg-transparent border-none focus:outline-none w-full ml-1 text-slate-900 dark:text-white font-semibold text-sm sm:text-base placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-violet-600/20 hover:shadow-violet-600/30 flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{homeContent.hero.ctaButton}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Microcopy de Garantias */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 gap-2">
              {homeContent.hero.guarantees.map((guarantee, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400" />
                  {guarantee}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Coluna Direita: Mockup do Celular com Abas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex-1 w-full max-w-md relative z-10"
        >
          {/* Seletor de Abas de Nichos */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            {profileKeys.map((key) => {
              const prof = homeContent.profiles[key];
              const isSelected = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTabSelect(key)}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-violet-600 text-violet-700 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {prof.tabLabel}
                </button>
              );
            })}
          </div>

          {/* Carcaça do Smartphone */}
          <div className="w-full max-w-[340px] sm:max-w-[360px] aspect-[9/17.5] bg-white dark:bg-slate-950 rounded-[2.75rem] border-[7px] border-slate-900 dark:border-slate-800 shadow-2xl shadow-slate-300/60 dark:shadow-violet-950/40 relative overflow-hidden flex flex-col mx-auto">
            
            {/* Header / Banner do Perfil Demo */}
            <div className={`h-36 bg-gradient-to-br ${currentProfile.bannerGradient} w-full relative p-4 flex flex-col justify-end transition-all duration-500`}>
              {/* Badge de Prova Social Superior */}
              <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                <span>{currentProfile.socialProof}</span>
              </div>

              {/* Avatar Circular em CSS Puro com Iniciais */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-18 h-18 bg-white dark:bg-slate-950 rounded-full p-1 shadow-lg">
                <div className={`w-full h-full rounded-full bg-gradient-to-tr ${currentProfile.avatarGradient} flex items-center justify-center text-white font-extrabold text-lg shadow-inner`}>
                  {currentProfile.initials}
                </div>
              </div>
            </div>

            {/* Conteúdo do Perfil Demo */}
            <div className="pt-10 px-4 pb-4 flex-1 bg-white dark:bg-slate-950 flex flex-col gap-2.5 text-center overflow-y-auto">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                  <span>{currentProfile.name}</span>
                  <ShieldCheck size={16} className="text-violet-600 dark:text-violet-400" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentProfile.role}</p>
              </div>

              {/* Links Dinâmicos */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2 mt-1"
                >
                  {currentProfile.links.map((link, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm border transition-all cursor-default ${
                        link.type === 'whatsapp'
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                          : link.type === 'emergency'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : link.type === 'video'
                          ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {link.type === 'whatsapp' && <MessageCircle size={15} className="shrink-0" />}
                        {link.type === 'emergency' && <AlertTriangle size={15} className="shrink-0" />}
                        {link.type === 'video' && <Play size={14} className="shrink-0 fill-current" />}
                        {link.type === 'link' && <Scissors size={14} className="shrink-0 opacity-70" />}
                        <span className="truncate">{link.label}</span>
                      </div>
                      <ChevronRight size={14} className="opacity-60 shrink-0" />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Rodapé do Mockup */}
              <div className="mt-auto pt-3 flex items-center justify-center gap-1 text-[11px] text-slate-400">
                <span>contate.site/</span>
                <span className="font-bold text-violet-600 dark:text-violet-400">{activeTab}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
