import React from 'react';
import { 
  Scissors, HeartPulse, Stethoscope, Dumbbell, 
  Sparkles, Apple, Camera, Video 
} from 'lucide-react';
import { homeContent } from '@/lib/homeContent.js';

const iconMap = {
  Scissors: Scissors,
  HeartPulse: HeartPulse,
  Stethoscope: Stethoscope,
  Dumbbell: Dumbbell,
  Sparkles: Sparkles,
  Apple: Apple,
  Camera: Camera,
  Video: Video,
};

export const SegmentsBar = () => {
  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center">
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">
            {homeContent.segments.label}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {homeContent.segments.items.map((item, idx) => {
              const IconComponent = iconMap[item.icon] || Sparkles;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:border-violet-400 dark:hover:border-violet-600 transition-colors cursor-default"
                >
                  <IconComponent size={15} className="text-violet-600 dark:text-violet-400" />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
