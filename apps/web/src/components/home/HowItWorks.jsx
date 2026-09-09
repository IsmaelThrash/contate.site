import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Palette, Share2, ArrowRight, Sparkles } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

const stepIcons = [Link2, Palette, Share2];

export const HowItWorks = () => {
  return (
    <section 
      id="como-funciona" 
      aria-labelledby="como-funciona-heading"
      className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
    >
      {/* Header da Seção */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 mb-3">
          <Sparkles size={12} />
          Passo a Passo Simples
        </span>
        <h2 
          id="como-funciona-heading"
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 font-['Sora']"
        >
          {homeContent.howItWorks.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          {homeContent.howItWorks.subtitle}
        </p>
      </div>

      {/* Grid de 3 Passos com Animação em Cascata ao Rolar */}
      <div className="grid md:grid-cols-3 gap-8 relative">
        {homeContent.howItWorks.steps.map((step, idx) => {
          const StepIcon = stepIcons[idx] || Link2;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all hover:border-indigo-400 dark:hover:border-indigo-600 flex flex-col justify-between group backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <StepIcon size={24} />
                  </div>
                  <span className="text-4xl font-black font-mono text-slate-200 dark:text-slate-800 group-hover:text-indigo-500/40 transition-colors select-none">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Passo {idx + 1} de 3</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
