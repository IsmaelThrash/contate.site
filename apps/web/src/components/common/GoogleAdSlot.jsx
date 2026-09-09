import React, { useEffect } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

/**
 * GoogleAdSlot Component
 * - variant="landing": Horizontal banner (Leaderboard 728x90 / Responsive) for homepage/landing sections.
 * - variant="profile": Mobile-first banner (320x50 / 300x100) for free user profile pages (/:slug).
 * - Safe fallback: Renders a sleek Tech Dark placeholder when adsbygoogle script is not loaded or during preview/development.
 */
export const GoogleAdSlot = ({
  variant = 'landing',
  slotId = '',
  client = '',
  className = ''
}) => {
  useEffect(() => {
    // If real AdSense credentials exist and script is loaded, push ad request
    try {
      if (client && slotId && typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn('AdSense slot initialization:', err);
    }
  }, [client, slotId]);

  // Variant: Profile Page (Free tier bio pages)
  if (variant === 'profile') {
    return (
      <div className={`w-full max-w-md mx-auto my-6 px-2 ${className}`}>
        <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/15 dark:border-white/5 rounded-2xl p-3 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Header discreto com upsell do Plano Pro */}
          <div className="w-full flex items-center justify-between text-[10px] text-foreground/50 mb-2 px-1">
            <span className="uppercase tracking-wider font-semibold">Anúncio</span>
            <a
              href="/#planos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
            >
              <span>Remover no Plano Pro</span>
              <ExternalLink size={10} />
            </a>
          </div>

          {/* Área Real do Anúncio ou Placeholder Demonstrativo */}
          {client && slotId ? (
            <ins
              className="adsbygoogle block w-full text-center"
              style={{ display: 'block', minHeight: '60px' }}
              data-ad-client={client}
              data-ad-slot={slotId}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          ) : (
            <div className="w-full h-16 sm:h-20 rounded-xl bg-white/5 dark:bg-black/20 border border-dashed border-white/20 flex flex-col items-center justify-center text-center p-2">
              <span className="text-xs font-bold text-foreground/70 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                Espaço Google Ads (Mobile 320x50 / 300x100)
              </span>
              <span className="text-[10px] text-foreground/40 mt-0.5">
                Exibido automaticamente apenas no Plano Grátis
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant: Landing Page (Horizontal Leaderboard between sections)
  return (
    <section 
      aria-label="Espaço de Publicidade"
      className={`py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10 ${className}`}
    >
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
        {/* Micro-label discreto de identificação */}
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
          <span>Publicidade Patrocinada · Google Ads</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:dark:bg-slate-600" />
        </div>

        {/* Área Real do AdSense ou Placeholder Responsivo */}
        {client && slotId ? (
          <div className="min-h-[90px] flex items-center justify-center">
            <ins
              className="adsbygoogle block w-full text-center"
              style={{ display: 'block' }}
              data-ad-client={client}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          <div className="w-full min-h-[90px] sm:min-h-[100px] rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-dashed border-slate-300/80 dark:border-slate-800 flex flex-col items-center justify-center p-4 transition-colors">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
              <Sparkles size={16} className="text-indigo-500" />
              <span>Espaço Google AdSense (Leaderboard 728x90 / 970x90 Responsivo)</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-md">
              Posicionado estrategicamente entre seções para monetização sem poluir o visual ou prejudicar conversões.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
