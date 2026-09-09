import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { homeContent } from '@/lib/homeContent.js';

export const PricingSection = () => {
  const navigate = useNavigate();
  const { pricing } = homeContent;

  return (
    <section 
      id="planos" 
      aria-labelledby="planos-heading"
      className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 mb-3">
          <Sparkles size={12} />
          Preço Justo & Transparente
        </span>
        <h2 
          id="planos-heading"
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 font-['Sora']"
        >
          {pricing.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
          {pricing.subtitle}
        </p>
      </div>

      {/* Cards de Preço */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Card Grátis (Destaque Principal) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative bg-white dark:bg-slate-900/95 border-2 border-indigo-500/80 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 flex flex-col justify-between backdrop-blur-sm"
        >
          {/* Badge Superior */}
          <div className="absolute -top-3.5 left-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles size={12} />
            <span>{pricing.freeCard.badge}</span>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-4 mt-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Sora']">
                {pricing.freeCard.name}
              </h3>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                {pricing.freeCard.price}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                / {pricing.freeCard.period}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              {pricing.freeCard.description}
            </p>

            <ul className="space-y-3.5 mb-8">
              {pricing.freeCard.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group text-base"
          >
            <span>{pricing.freeCard.ctaText}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Card Pro (Em Breve) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm opacity-90 hover:opacity-100 transition-opacity"
        >
          <div>
            <div className="flex justify-between items-baseline mb-4 mt-2">
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 font-['Sora']">
                {pricing.proCard.name}
              </h3>
              <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full">
                {pricing.proCard.badge}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl sm:text-4xl font-black text-slate-600 dark:text-slate-400">
                {pricing.proCard.price}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                / {pricing.proCard.period}
              </span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {pricing.proCard.description}
            </p>

            <ul className="space-y-3.5 mb-8">
              {pricing.proCard.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            disabled
            className="w-full bg-slate-200 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold py-4 px-6 rounded-2xl cursor-not-allowed text-sm"
          >
            {pricing.proCard.ctaText}
          </button>
        </motion.div>

      </div>
    </section>
  );
};
