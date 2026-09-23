import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, 
  Code2, 
  Check, 
  QrCode, 
  MoreHorizontal 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ShareMenu = ({ 
  url, 
  title = 'contate.site', 
  onOpenQrCode,
  align = 'right',
  triggerText = 'Compartilhar',
  triggerClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const menuRef = useRef(null);
  const { toast } = useToast();

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://contate.site');
  const shareText = `Confira os links de ${title} em: ${shareUrl}`;

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fechar com Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      toast({
        title: 'Link copiado!',
        description: shareUrl,
        duration: 2500
      });
      setTimeout(() => {
        setCopiedLink(false);
        setIsOpen(false);
      }, 1000);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive'
      });
    }
  };

  const handleEmbed = async () => {
    const embedSnippet = `<iframe src="${shareUrl}" width="100%" height="720" style="border:none;border-radius:16px;max-width:520px;display:block;margin:0 auto;" title="${title}"></iframe>`;
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopiedEmbed(true);
      toast({
        title: 'Código de incorporação copiado!',
        description: 'Cole a tag <iframe> no seu site ou blog.',
        duration: 3000
      });
      setTimeout(() => {
        setCopiedEmbed(false);
        setIsOpen(false);
      }, 1000);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o código.',
        variant: 'destructive'
      });
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleMoreOptions = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Acesse meu link em contate.site:`,
          url: shareUrl
        });
        setIsOpen(false);
      } catch (e) {
        if (e.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleQrClick = () => {
    setIsOpen(false);
    if (onOpenQrCode) {
      onOpenQrCode();
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Botão de Disparo estilo Reddit (com seta curva) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={
          triggerClassName || 
          "flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#111622]/90 hover:bg-[#1A2234] text-slate-100 font-semibold text-xs sm:text-sm border border-white/15 shadow-xl backdrop-blur-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
        }
        title="Compartilhar"
        aria-expanded={isOpen}
      >
        {/* Ícone de seta curva de compartilhar (estilo Reddit) */}
        <svg 
          viewBox="0 0 24 24" 
          width="16" 
          height="16" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-slate-200 shrink-0"
        >
          <path d="M4 20v-6a5 5 0 0 1 5-5h10" />
          <path d="M15 5l5 4-5 4" />
        </svg>
        <span>{triggerText}</span>
      </button>

      {/* Menu Flutuante Estilo Reddit */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-52 p-1.5 rounded-2xl bg-[#0D121D] border border-slate-800 shadow-2xl backdrop-blur-2xl z-50 flex flex-col gap-0.5 text-slate-200 text-sm font-medium`}
          >
            {/* 1. Copiar Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-left cursor-pointer group"
            >
              {copiedLink ? (
                <Check size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Link2 size={16} className="text-slate-300 group-hover:text-white shrink-0" />
              )}
              <span className="flex-1 truncate">{copiedLink ? 'Link copiado!' : 'Copiar link'}</span>
            </button>

            {/* Separador */}
            <div className="h-px bg-slate-800/90 my-0.5 mx-2" />

            {/* 2. Incorporar */}
            <button
              type="button"
              onClick={handleEmbed}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-left cursor-pointer group"
            >
              {copiedEmbed ? (
                <Check size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Code2 size={16} className="text-slate-300 group-hover:text-white shrink-0" />
              )}
              <span className="flex-1 truncate">{copiedEmbed ? 'Código copiado!' : 'Incorporar'}</span>
            </button>

            {/* Separador */}
            <div className="h-px bg-slate-800/90 my-0.5 mx-2" />

            {/* 3. X (Twitter) */}
            <button
              type="button"
              onClick={handleX}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-left cursor-pointer group"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" className="text-slate-300 group-hover:text-white shrink-0">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="flex-1 truncate">X</span>
            </button>

            {/* 4. WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-left cursor-pointer group"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-emerald-400 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="flex-1 truncate">WhatsApp</span>
            </button>

            {/* 5. QR Code (se houver callback) */}
            {onOpenQrCode && (
              <>
                <div className="h-px bg-slate-800/90 my-0.5 mx-2" />
                <button
                  type="button"
                  onClick={handleQrClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-left cursor-pointer group"
                >
                  <QrCode size={16} className="text-blue-400 group-hover:text-blue-300 shrink-0" />
                  <span className="flex-1 truncate">Ver QR Code</span>
                </button>
              </>
            )}

            {/* Separador */}
            <div className="h-px bg-slate-800/90 my-0.5 mx-2" />

            {/* 6. Mais opções */}
            <button
              type="button"
              onClick={handleMoreOptions}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-left cursor-pointer group text-xs text-slate-400 hover:text-slate-200"
            >
              <MoreHorizontal size={16} className="shrink-0 text-slate-400 group-hover:text-white" />
              <span className="flex-1 truncate">Mais opções</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
