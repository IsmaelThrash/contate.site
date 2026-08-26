import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight, MessageCircle, Play, 
  MapPin, Scissors, ShieldCheck, AlertTriangle, ExternalLink 
} from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

export const ShowcaseTabs = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('beleza');
  const profileKeys = ['beleza', 'pet', 'saude', 'criador'];
  const profile = homeContent.profiles[selectedKey];

  return (
    <section id="exemplos" className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
            Demonstração Prática
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 mb-4">
            Uma página que parece feita sob medida
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Veja como o contate.site organiza os serviços e contatos de diferentes profissões para converter cliques em atendimentos.
          </p>
        </div>

        {/* Abas */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {profileKeys.map((key) => {
            const p = homeContent.profiles[key];
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Card Principal de Comparação / Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedKey}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl grid lg:grid-cols-12 gap-10 items-center"
          >
            {/* Coluna Esquerda: Explicação de Benefícios */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                <span>{profile.socialProof}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {profile.benefitHeadline}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                {profile.benefitText}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Botão direto para o WhatsApp com mensagem personalizada</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Espaço para vídeos explicativos ou demonstração do trabalho</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Acesso imediato no celular sem precisar baixar app</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                >
                  <span>Criar página para {profile.tabLabel}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Coluna Direita: Preview Visual da Página Pública */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-inner">
                {/* Header Mockup */}
                <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 rounded-full mx-auto p-1 bg-white dark:bg-slate-900 shadow-md mb-2">
                    <div className={`w-full h-full rounded-full bg-gradient-to-tr ${profile.avatarGradient} flex items-center justify-center text-white font-extrabold text-lg`}>
                      {profile.initials}
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center justify-center gap-1">
                    {profile.name}
                    <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{profile.role}</p>
                </div>

                {/* Lista de Links no Preview */}
                <div className="space-y-2.5 pt-4">
                  {profile.links.map((link, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between border shadow-sm transition-all ${
                        link.type === 'whatsapp'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : link.type === 'emergency'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : link.type === 'video'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {link.type === 'whatsapp' && <MessageCircle size={16} className="shrink-0" />}
                        {link.type === 'emergency' && <AlertTriangle size={16} className="shrink-0" />}
                        {link.type === 'video' && <Play size={15} className="shrink-0 fill-current" />}
                        {link.type === 'link' && <Scissors size={15} className="shrink-0 opacity-60" />}
                        <span className="truncate">{link.label}</span>
                      </div>
                      <ExternalLink size={14} className="opacity-60 shrink-0" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 text-center text-[10px] text-slate-400 font-mono">
                  contate.site/{selectedKey}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
