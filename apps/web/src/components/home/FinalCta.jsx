import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

export const FinalCta = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950 rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl border border-violet-500/30">
        
        {/* Efeitos de Iluminação de Fundo */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-violet-200 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles size={14} className="text-cyan-300" />
            <span>Comece hoje sem nenhum custo</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            {homeContent.finalCta.title}
          </h2>

          <p className="text-slate-200 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            {homeContent.finalCta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 font-extrabold py-4 px-9 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-base flex items-center justify-center gap-2 group"
            >
              <span>{homeContent.finalCta.ctaButton}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>{homeContent.finalCta.guaranteeText}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
