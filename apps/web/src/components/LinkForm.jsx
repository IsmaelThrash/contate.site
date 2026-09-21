import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Link2, Type, Video, Columns, Maximize2, Sparkles, Play } from 'lucide-react';
import { logger } from '@/lib/logger.js';

const LinkForm = ({ open, onOpenChange, link, onSuccess }) => {

  // Rejeita qualquer protocolo fora de http/https (ex: javascript:, data:)
  const isUrlSegura = (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [mediaType, setMediaType] = useState('link'); // 'link' | 'video'
  const [largura, setLargura] = useState('auto');     // 'compacto' | 'auto' | 'destaque'
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (link) {
      setTitulo(link.titulo || '');
      setUrl(link.url || '');
      
      if (link.tipo === 'video' || link.tipo === 'video_compacto') {
        setMediaType('video');
        setLargura(link.tipo === 'video_compacto' ? 'compacto' : 'destaque');
      } else if (link.tipo === 'destaque' || link.tipo === 'link_destaque') {
        setMediaType('link');
        setLargura('destaque');
      } else if (link.tipo === 'compacto' || link.tipo === 'link_compacto') {
        setMediaType('link');
        setLargura('compacto');
      } else {
        setMediaType('link');
        setLargura('auto');
      }
    } else {
      setTitulo('');
      setUrl('');
      setMediaType('link');
      setLargura('auto');
    }
  }, [link, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim() || !url.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive'
      });
      return;
    }

    if (!isUrlSegura(url.trim())) {
      toast({
        title: 'URL inválida',
        description: 'Use apenas endereços que comecem com https:// ou http://',
        variant: 'destructive'
      });
      return;
    }

    // Calcula o tipo final para salvar no banco
    let tipoFinal = 'link';
    if (mediaType === 'video') {
      tipoFinal = largura === 'compacto' ? 'video_compacto' : 'video';
    } else {
      if (largura === 'destaque') tipoFinal = 'destaque';
      else if (largura === 'compacto') tipoFinal = 'compacto';
      else tipoFinal = 'link';
    }

    setLoading(true);

    try {
      if (link) {
        const { error } = await supabase
          .from('blocos_links')
          .update({ titulo, url, tipo: tipoFinal })
          .eq('id', link.id);
          
        if (error) throw error;
        
        toast({
          title: 'Sucesso!',
          description: 'Link atualizado com sucesso.'
        });
      } else {
        const { data: existingLinks, error: fetchError } = await supabase
          .from('blocos_links')
          .select('ordem')
          .eq('usuario_id', currentUser.id)
          .order('ordem', { ascending: false })
          .limit(1);
          
        if (fetchError) throw fetchError;
        
        const maxOrdem = existingLinks && existingLinks.length > 0 ? existingLinks[0].ordem : 0;
        
        const { error: createError } = await supabase
          .from('blocos_links')
          .insert({
            usuario_id: currentUser.id,
            tipo: tipoFinal,
            titulo,
            url,
            ordem: maxOrdem + 1,
            ativo: true
          });
          
        if (createError) throw createError;
        
        toast({
          title: 'Sucesso!',
          description: 'Link adicionado com sucesso.'
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      logger.error('Error saving link:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao salvar link. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-card border-white/10 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">
            {link ? 'Editar Link' : 'Adicionar Novo Link'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Tipo de Bloco */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tipo de Bloco
            </Label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/40 rounded-xl border border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setMediaType('link');
                  if (largura === 'destaque' && !link) setLargura('auto');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  mediaType === 'link'
                    ? 'bg-background text-foreground shadow-sm border border-white/10 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Link2 className="h-4 w-4 text-blue-500" />
                <span>Botão de Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaType('video');
                  setLargura('destaque'); // Vídeos por padrão são 100% largura
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  mediaType === 'video'
                    ? 'bg-background text-foreground shadow-sm border border-white/10 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Play className="h-4 w-4 text-red-500 fill-current" />
                <span>Vídeo Embed</span>
              </button>
            </div>
          </div>

          {/* Formato / Largura do Card (Seletor Solicitado pelo Usuário) */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-background/50 border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tamanho de Exibição
              </Label>
              <span className="text-[11px] font-medium text-blue-400">
                {largura === 'compacto' && '50% • Meia Coluna'}
                {largura === 'auto' && 'Automático • Bento Grid'}
                {largura === 'destaque' && '100% • Largura Total'}
              </span>
            </div>

            {mediaType === 'link' ? (
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/40 rounded-xl border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setLargura('compacto')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    largura === 'compacto'
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Columns className="h-3.5 w-3.5 shrink-0" />
                  <span>Menor (50%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLargura('auto')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    largura === 'auto'
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>Auto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLargura('destaque')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    largura === 'destaque'
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Maximize2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Maior (100%)</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/40 rounded-xl border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setLargura('destaque')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    largura === 'destaque'
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Maximize2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Maior (100% • Recomendado)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLargura('compacto')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    largura === 'compacto'
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Columns className="h-3.5 w-3.5 shrink-0" />
                  <span>Menor (50%)</span>
                </button>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
              {mediaType === 'video' ? (
                largura === 'destaque' 
                  ? '✦ O vídeo ocupará a linha inteira, garantindo proporção 16:9 de cinema perfeita em qualquer posição.'
                  : '✦ O vídeo ficará em meia coluna, ideal para compartilhar espaço com outro link ao lado.'
              ) : (
                largura === 'compacto'
                  ? '✦ Ocupa meia largura (50%) para agrupar botões em pares alinhados lado a lado.'
                  : largura === 'destaque'
                  ? '✦ Ocupa a linha inteira (100%) com destaque máximo (ótimo para WhatsApp, Loja ou Vendas).'
                  : '✦ Alternância dinâmica do Bento Grid (o primeiro link de cada trio expande automaticamente).'
              )}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Type className="h-3.5 w-3.5 text-blue-500" />
              Título do Link
            </Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={mediaType === 'video' ? 'Ex: Assista meu Último Vídeo' : 'Ex: Meu WhatsApp / Instagram'}
              className="h-11 rounded-xl bg-background/60 border-white/[0.08] focus:border-blue-500/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Link2 className="h-3.5 w-3.5 text-blue-500" />
              {mediaType === 'video' ? 'URL do Vídeo (YouTube, Vimeo ou TikTok)' : 'URL de Destino'}
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={mediaType === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
              className="h-11 rounded-xl bg-background/60 border-white/[0.08] focus:border-blue-500/50"
              required
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl h-10 px-4 text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl h-10 px-6 font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/20"
            >
              {loading ? 'Salvando...' : link ? 'Atualizar Link' : 'Adicionar Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LinkForm;

