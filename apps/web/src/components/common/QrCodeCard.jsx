import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QrCodeCard = ({ 
  slug, 
  title, 
  variant = 'compact', // 'compact' | 'tv' | 'modal'
  showActions = true,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(true);
  const { toast } = useToast();

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${slug}` 
    : `https://contate.site/${slug}`;

  useEffect(() => {
    let isMounted = true;
    const generateQr = async () => {
      if (!canvasRef.current || !slug) return;
      setGenerating(true);

      const canvas = canvasRef.current;
      const size = variant === 'tv' ? 360 : 280;

      try {
        // 1. Renderiza o QR Code com Error Correction Level H (30% de redundância)
        await QRCode.toCanvas(canvas, publicUrl, {
          width: size,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#080A0F',
            light: '#FFFFFF'
          }
        });

        // 2. Sobrepõe o badge circular branco com o logo oficial da marca (Versão 1A)
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const badgeRadius = size * 0.12;

        // Fundo circular branco do logo
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, badgeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;
        ctx.fill();

        // Borda sutil de acabamento
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#E2E8F0';
        ctx.stroke();
        ctx.restore();

        // Desenhar o ícone oficial /favicon.svg no centro
        const logo = new Image();
        logo.src = '/favicon.svg';
        logo.crossOrigin = 'anonymous';
        logo.onload = () => {
          if (!isMounted) return;
          const logoSize = badgeRadius * 1.35;
          ctx.drawImage(
            logo,
            centerX - logoSize / 2,
            centerY - logoSize / 2,
            logoSize,
            logoSize
          );
          setGenerating(false);
        };
        logo.onerror = () => {
          if (isMounted) setGenerating(false);
        };
      } catch (err) {
        console.error('Erro ao gerar QR Code:', err);
        if (isMounted) setGenerating(false);
      }
    };

    generateQr();
    return () => { isMounted = false; };
  }, [slug, publicUrl, variant]);

  // Copiar link para o clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast({
        title: 'Link copiado!',
        description: publicUrl,
        duration: 3000
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive'
      });
    }
  };

  // Compartilhar nativo (se suportado pelo navegador do celular)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || `@${slug} - contate.site`,
          text: `Acesse todos os meus links em um só lugar:`,
          url: publicUrl
        });
      } catch (e) {
        if (e.name !== 'AbortError') handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Download do QR Code em Alta Resolução (1200x1450 PNG) pronto para gráfica
  const handleDownloadPng = () => {
    try {
      const exportCanvas = document.createElement('canvas');
      const exportWidth = 1200;
      const exportHeight = 1450;
      exportCanvas.width = exportWidth;
      exportCanvas.height = exportHeight;
      const ctx = exportCanvas.getContext('2d');

      // Fundo Branco do Card
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      // Borda decorativa superior gradiente Cobalto/Índigo
      const grad = ctx.createLinearGradient(0, 0, exportWidth, 0);
      grad.addColorStop(0, '#6366F1');
      grad.addColorStop(0.5, '#3B82F6');
      grad.addColorStop(1, '#38BDF8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, exportWidth, 24);

      // Título ou Nome de Exibição
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 56px Sora, system-ui, sans-serif';
      ctx.textAlign = 'center';
      const displayTitle = title ? title.slice(0, 26) : `@${slug}`;
      ctx.fillText(displayTitle, exportWidth / 2, 130);

      // Subtítulo
      ctx.fillStyle = '#64748B';
      ctx.font = '500 32px system-ui, sans-serif';
      ctx.fillText('Aponte a câmera do seu celular para abrir', exportWidth / 2, 185);

      // Desenhar o QR Code ampliado no centro
      const qrCanvas = canvasRef.current;
      const qrRenderSize = 880;
      const qrX = (exportWidth - qrRenderSize) / 2;
      const qrY = 240;

      // Moldura suave para o QR Code
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(qrX - 20, qrY - 20, qrRenderSize + 40, qrRenderSize + 40, 36);
      ctx.fill();
      ctx.stroke();

      ctx.drawImage(qrCanvas, qrX, qrY, qrRenderSize, qrRenderSize);

      // Link oficial estilizado no rodapé
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 40px Sora, monospace';
      ctx.fillText(`contate.site/${slug}`, exportWidth / 2, 1220);

      // Badge de rodapé
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 26px system-ui, sans-serif';
      ctx.fillText('⚡ Crie seu link grátis em contate.site', exportWidth / 2, 1280);

      // Disparar Download
      const link = document.createElement('a');
      link.download = `qrcode-${slug}.png`;
      link.href = exportCanvas.toDataURL('image/png', 1.0);
      link.click();

      toast({
        title: 'QR Code Baixado!',
        description: `Arquivo salvo em alta resolução: qrcode-${slug}.png`,
        duration: 4000
      });
    } catch (err) {
      console.error('Falha ao exportar QR Code:', err);
      toast({
        title: 'Erro no download',
        description: 'Não foi possível gerar a imagem em alta resolução.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Moldura de Alto Contraste do QR Code */}
      <div className="relative p-3.5 sm:p-4 bg-white rounded-3xl shadow-xl border border-slate-200/90 flex items-center justify-center transition-transform hover:scale-[1.01]">
        <canvas 
          ref={canvasRef} 
          className="rounded-2xl max-w-full h-auto block"
        />
        {generating && (
          <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* URL de Exibição */}
      <div className="mt-3.5 text-center">
        <span className="font-sora font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
          contate<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#38BDF8]">.site</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">/{slug}</span>
        </span>
      </div>

      {/* Botões de Ação */}
      {showActions && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full max-w-xs">
          <button
            onClick={handleCopyLink}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 transition-all cursor-pointer"
            title="Copiar link da página"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-sm shadow-blue-500/20 border border-blue-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
            title="Baixar imagem em alta resolução para imprimir"
          >
            <Download size={15} />
            <span>Baixar PNG</span>
          </button>

          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleShare}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Share2 size={13} />
              <span>Compartilhar via Celular</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
