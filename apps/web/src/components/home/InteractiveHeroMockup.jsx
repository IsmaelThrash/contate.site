import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Play, Scissors, AlertTriangle, ShieldCheck, 
  ChevronRight, Sparkles
} from 'lucide-react';

/**
 * InteractiveHeroMockup
 * - 3D Perspective Tilt on Mouse Pointer
 * - Clean Mockup (No external floating cards)
 * - Interactive Simulated Link/WhatsApp Click Feedback
 * - Complies with AGENTS.md rules
 */
export const InteractiveHeroMockup = ({ 
  currentProfile, 
  activeTab, 
  profileKeys, 
  onTabSelect 
}) => {
  const containerRef = useRef(null);
  const [clickSimulationMessage, setClickSimulationMessage] = useState(null);

  // Mouse physics values for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D rotations for the phone body
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSimulateClick = (link) => {
    if (link.type === 'whatsapp') {
      setClickSimulationMessage('Simulação: Abrindo WhatsApp com mensagem pronta!');
    } else {
      setClickSimulationMessage(`Simulação: Acessando "${link.label}"`);
    }
    setTimeout(() => {
      setClickSimulationMessage(null);
    }, 3200);
  };

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="flex-1 w-full max-w-md relative z-10 select-none perspective-[1200px]"
    >
      {/* Seletor de Abas de Nichos */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 bg-slate-100/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner backdrop-blur-sm">
        {profileKeys.map((key) => {
          const isSelected = activeTab === key;
          const labels = {
            beleza: 'Beleza',
            pet: 'Pet',
            saude: 'Saúde',
            criador: 'Criador'
          };
          return (
            <button
              key={key}
              onClick={() => onTabSelect(key)}
              className={`flex-1 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 relative ${
                isSelected
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {labels[key] || key}
            </button>
          );
        })}
      </div>

      {/* Container 3D com Smartphone */}
      <div className="relative py-2">
        {/* Smartphone Body com 3D Tilt */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
          }}
          className="w-full max-w-[335px] sm:max-w-[355px] aspect-[9/17.8] bg-white dark:bg-slate-950 rounded-[2.85rem] border-[8px] border-slate-900 dark:border-slate-800 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-950/60 relative overflow-hidden flex flex-col mx-auto transition-shadow duration-300"
        >
          {/* Dynamic Island / Alto-Falante */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 animate-pulse" />
          </div>

          {/* Banner do Perfil com Gradiente */}
          <div className={`h-36 bg-gradient-to-br ${currentProfile.bannerGradient} w-full relative p-4 flex flex-col justify-end transition-all duration-500`}>
            {/* Tag de Especialidade */}
            <div className="absolute top-8 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm">
              <Sparkles size={11} className="text-amber-400" />
              <span>{currentProfile.tabLabel}</span>
            </div>
          </div>

          {/* Conteúdo do Perfil */}
          <div className="flex-1 bg-white dark:bg-slate-950 px-5 pt-0 pb-5 flex flex-col justify-between -mt-8 relative z-10">
            <div className="flex flex-col items-center text-center">
              {/* Avatar do Profissional */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${currentProfile.avatarGradient} p-0.5 shadow-lg mb-2`}>
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-base font-black border-2 border-white dark:border-slate-950">
                  {currentProfile.initials || 'CS'}
                </div>
              </div>

              {/* Nome & Verificado */}
              <div className="flex items-center gap-1.5 justify-center">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight font-['Sora']">
                  {currentProfile.name}
                </h3>
                <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {currentProfile.role}
              </p>

              {/* Links Interativos (Com Simulação ao Clicar) */}
              <div className="w-full mt-3.5 space-y-2">
                {currentProfile.links.map((link, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSimulateClick(link)}
                    className={`w-full p-2.5 sm:p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm border transition-all text-left ${
                      link.type === 'whatsapp'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-emerald-600/20'
                        : link.type === 'emergency'
                        ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-rose-600/20'
                        : link.type === 'video'
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {link.type === 'whatsapp' && <MessageCircle size={15} className="shrink-0" />}
                      {link.type === 'emergency' && <AlertTriangle size={15} className="shrink-0" />}
                      {link.type === 'video' && <Play size={13} className="shrink-0 fill-current" />}
                      {link.type === 'link' && <Scissors size={14} className="shrink-0 opacity-70" />}
                      <span className="truncate">{link.label}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-60 shrink-0" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Rodapé Interno do Celular */}
            <div className="text-center pt-2.5 border-t border-slate-100 dark:border-slate-900/80">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                contate.site/<span className="font-bold text-indigo-600 dark:text-indigo-400">{activeTab}</span>
              </span>
            </div>
          </div>

          {/* Feedback de Simulação Flutuante */}
          <AnimatePresence>
            {clickSimulationMessage && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-14 left-4 right-4 z-50 bg-slate-900/95 dark:bg-indigo-950/95 backdrop-blur-md text-white text-[11px] p-2.5 rounded-xl border border-indigo-500/50 shadow-2xl text-center flex items-center justify-center gap-1.5"
              >
                <Sparkles size={13} className="text-amber-400 shrink-0" />
                <span className="font-semibold">{clickSimulationMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
