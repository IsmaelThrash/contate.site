import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCodeCard } from './QrCodeCard.jsx';
import { QrCode, X } from 'lucide-react';

export const QrCodeModal = ({ open, onOpenChange, slug, title }) => {
  // Fecha com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Bloqueia a rolagem do body quando o modal estiver aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Escuro com Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Card do Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm bg-white dark:bg-[#0E121A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 overflow-hidden"
          >
            {/* Botão de Fechar */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X size={18} />
            </button>

            {/* Cabeçalho */}
            <div className="text-center pb-2">
              <div className="w-12 h-12 rounded-2xl mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <QrCode size={24} />
                </div>
              </div>
              <h3 className="text-xl font-sora font-extrabold text-slate-900 dark:text-white">
                Compartilhar via QR Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Aponte a câmera do celular ou baixe a imagem para imprimir em balcões, mesas e cartões.
              </p>
            </div>

            {/* Conteúdo do QR Code */}
            <div className="py-2 flex justify-center">
              <QrCodeCard 
                slug={slug} 
                title={title} 
                variant="modal" 
                showActions={true} 
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
