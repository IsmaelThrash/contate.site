import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Palette, Share2, ArrowRight } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

const stepIcons = [Link2, Palette, Share2];

export const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header da Seção */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          {homeContent.howItWorks.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          {homeContent.howItWorks.subtitle}
        </p>
      </div>

      {/* Grid de 3 Passos */}
      <div className="grid md:grid-cols-3 gap-8 relative">
        {homeContent.howItWorks.steps.map((step, idx) => {
          const StepIcon = stepIcons[idx] || Link2;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:border-violet-300 dark:hover:border-violet-700 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                    <StepIcon size={24} />
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-200 dark:text-slate-800 group-hover:text-violet-500/40 transition-colors">
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

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400">
                <span>Passo {idx + 1} de 3</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
