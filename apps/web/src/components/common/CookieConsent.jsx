import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já expressou consentimento anteriormente
    const consent = localStorage.getItem('contate_cookie_consent');
    if (!consent) {
      // Pequeno delay de 1.2s para entrada suave sem sobrecarregar a primeira renderização
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('contate_cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('contate_cookie_consent', 'essential');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-full pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0E121A]/95 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 text-foreground">
            {/* Linha de brilho sutil no topo */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent" />

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-heading font-bold text-white tracking-tight flex items-center gap-1.5">
                    Sua Privacidade & Cookies
                  </h4>
                  <button
                    onClick={handleAcceptEssential}
                    className="text-muted-foreground hover:text-white p-1 rounded-lg transition-colors"
                    title="Fechar e aceitar apenas essenciais"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Utilizamos cookies essenciais e tecnologias semelhantes para garantir segurança, desempenho e personalização na sua experiência. Saiba mais em nossa{' '}
                  <Link to="/privacidade" className="text-blue-400 hover:text-blue-300 underline font-medium">
                    Política de Privacidade (LGPD)
                  </Link>{' '}
                  e{' '}
                  <Link to="/termos" className="text-blue-400 hover:text-blue-300 underline font-medium">
                    Termos de Uso
                  </Link>.
                </p>

                <div className="flex items-center gap-2 mt-3.5 pt-1">
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="h-8 px-4 text-xs font-semibold rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25 border border-blue-400/25"
                  >
                    Aceitar Todos
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAcceptEssential}
                    className="h-8 px-3 text-xs font-medium rounded-xl border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white"
                  >
                    Apenas Necessários
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
