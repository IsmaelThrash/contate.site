import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

export const PricingSection = () => {
  const navigate = useNavigate();
  const { freeCard, proCard } = homeContent.pricing;

  return (
    <section id="planos" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
          Planos e Preços
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 mb-4">
          {homeContent.pricing.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          {homeContent.pricing.subtitle}
        </p>
      </div>

      {/* Grid de Planos */}
      <div className="grid md:grid-cols-12 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Card Principal: Plano Grátis */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border-2 border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-600/10 flex flex-col justify-between relative">
          <div className="absolute -top-3.5 left-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={13} />
            <span>{freeCard.badge}</span>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {freeCard.name}
              </h3>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                {freeCard.price}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {freeCard.period}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
              {freeCard.description}
            </p>

            <div className="space-y-3.5 mb-8">
              {freeCard.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Check size={13} className="stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:from-indigo-700 active:to-blue-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>{freeCard.ctaText}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Card Secundário: Plano Pro (Em Breve) */}
        <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between opacity-90">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                {proCard.name}
              </h3>
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                {proCard.badge}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-extrabold text-slate-700 dark:text-slate-300">
                {proCard.price}
              </span>
              <span className="text-xs text-slate-500">
                {proCard.period}
              </span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
              {proCard.description}
            </p>

            <div className="space-y-3 mb-8">
              {proCard.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                    <Check size={11} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock size={15} />
            <span>{proCard.ctaText}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
