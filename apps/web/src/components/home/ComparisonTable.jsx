import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

export const ComparisonTable = () => {
  const { comparison } = homeContent;

  return (
    <section 
      id="comparativo" 
      aria-labelledby="comparativo-heading"
      className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 mb-3">
          <Sparkles size={12} />
          Transparência Total
        </span>
        <h2 
          id="comparativo-heading"
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 font-['Sora']"
        >
          {comparison.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
          {comparison.subtitle}
        </p>
      </div>

      {/* Tabela Comparativa Estilizada com Destaque na Coluna contate.site */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-indigo-950/20 bg-white dark:bg-slate-900/90 backdrop-blur-sm"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
              <th className="py-5 px-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                {comparison.headers[0]}
              </th>
              <th className="py-5 px-6 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 border-x border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span>{comparison.headers[1]}</span>
                </div>
              </th>
              <th className="py-5 px-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
                {comparison.headers[2]}
              </th>
              <th className="py-5 px-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
                {comparison.headers[3]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
            {comparison.rows.map((row, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-200">
                  {row.feature}
                </td>
                <td className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20 border-x border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>{row.contate}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-500">✕</span>
                    <span>{row.competitor1}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-500">✕</span>
                    <span>{row.competitor2}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
};
