import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

export const ComparisonTable = () => {
  return (
    <section id="comparativo" className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400 font-bold">
            Comparativo Direto
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 mb-4">
            {homeContent.comparison.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {homeContent.comparison.subtitle}
          </p>
        </div>

        {/* Container da Tabela com Scroll Horizontal Suave no Mobile */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <th className="p-5 font-bold text-sm text-slate-700 dark:text-slate-300 w-2/5">
                    {homeContent.comparison.headers[0]}
                  </th>
                  <th className="p-5 font-extrabold text-sm text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-violet-950/40 border-x border-violet-200 dark:border-violet-800/80 w-1/5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={16} />
                      <span>{homeContent.comparison.headers[1]}</span>
                    </div>
                  </th>
                  <th className="p-5 font-bold text-sm text-slate-600 dark:text-slate-400 w-1/5">
                    {homeContent.comparison.headers[2]}
                  </th>
                  <th className="p-5 font-bold text-sm text-slate-600 dark:text-slate-400 w-1/5">
                    {homeContent.comparison.headers[3]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {homeContent.comparison.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-5 font-semibold text-sm text-slate-900 dark:text-slate-200">
                      {row.feature}
                    </td>
                    <td className="p-5 bg-violet-50/40 dark:bg-violet-950/20 border-x border-violet-100 dark:border-violet-900/40">
                      <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-bold text-sm">
                        <Check size={18} className="text-violet-600 dark:text-violet-400 shrink-0" />
                        <span>{row.contate}</span>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {row.competitor1}
                    </td>
                    <td className="p-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {row.competitor2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
