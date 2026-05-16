import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Link2, Type } from 'lucide-react';
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
  const [tipo, setTipo] = useState('link');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (link) {
      setTitulo(link.titulo || '');
      setUrl(link.url || '');
      setTipo(link.tipo || 'link');
    } else {
      setTitulo('');
      setUrl('');
      setTipo('link');
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

    setLoading(true);

    try {
      if (link) {
        const { error } = await supabase
          .from('blocos_links')
          .update({ titulo, url, tipo })
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
            tipo,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {link ? 'Editar Link' : 'Adicionar Novo Link'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Tipo de Bloco
            </Label>
            <div className="flex gap-4 p-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="tipo" 
                  value="link" 
                  checked={tipo === 'link'} 
                  onChange={() => setTipo('link')} 
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm font-medium">Botão de Link</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="tipo" 
                  value="video" 
                  checked={tipo === 'video'} 
                  onChange={() => setTipo('video')} 
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm font-medium">Vídeo Embed</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="titulo" className="flex items-center gap-2">
              <Type className="h-4 w-4 text-primary" />
              Título do Link
            </Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Meu Instagram"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              URL de Destino
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
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
