import React from 'react';
import { motion } from 'framer-motion';
import { 
  Link2, PlayCircle, Palette, Smartphone, 
  QrCode, Calendar, BarChart3, Globe, Sparkles, Check 
} from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

const iconMap = {
  Link2,
  PlayCircle,
  Palette,
  Smartphone,
  QrCode,
  Calendar,
  BarChart3,
  Globe,
  Sparkles,
};

export const FeaturesGrid = () => {
  return (
    <section 
      id="recursos" 
      aria-labelledby="recursos-heading"
      className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 mb-3">
          <Sparkles size={12} />
          Potência & Praticidade
        </span>
        <h2 
          id="recursos-heading"
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 mb-4 font-['Sora']"
        >
          {homeContent.features.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
          {homeContent.features.subtitle}
        </p>
      </div>

      {/* Grade de Recursos Reais e Ativos com Efeito Hover Suave */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {homeContent.features.real.map((item, idx) => {
          const IconComponent = iconMap[item.icon] || Link2;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all hover:border-indigo-400 dark:hover:border-indigo-600 flex flex-col justify-between group backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <IconComponent size={24} />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                    <Check size={12} /> {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Caixa de Recursos Futuros ("Em Breve") */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {homeContent.features.upcomingTitle}
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {homeContent.features.upcoming.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || Sparkles;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      <IconComponent size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                      Em breve
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
