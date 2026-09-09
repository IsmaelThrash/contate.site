import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

export const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section 
      id="faq" 
      aria-labelledby="faq-heading"
      className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 relative z-10"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
            <Sparkles size={12} />
            Perguntas Frequentes & Ajuda
          </span>
          <h2 
            id="faq-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3 mb-4 font-['Sora']"
          >
            {homeContent.faq.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            {homeContent.faq.subtitle}
          </p>
        </div>

        {/* Lista Sanfonada de FAQs com Animação Suave */}
        <div className="space-y-4">
          {homeContent.faq.items.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900/90 border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
                  isOpen 
                    ? 'border-indigo-500/50 dark:border-indigo-500/40 shadow-indigo-500/5 ring-1 ring-indigo-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between text-slate-900 dark:text-white font-bold text-base sm:text-lg focus:outline-none gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle 
                      size={20} 
                      className={`shrink-0 transition-colors ${
                        isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                      }`} 
                    />
                    <span className="leading-snug">{item.q}</span>
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
