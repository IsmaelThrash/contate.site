
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Link2, Type } from 'lucide-react';

const LinkForm = ({ open, onOpenChange, link, onSuccess }) => {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (link) {
      setTitulo(link.titulo || '');
      setUrl(link.url || '');
    } else {
      setTitulo('');
      setUrl('');
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

    setLoading(true);

    try {
      if (link) {
        await pb.collection('links').update(
          link.id,
          { titulo, url },
          { $autoCancel: false }
        );
        toast({
          title: 'Sucesso!',
          description: 'Link atualizado com sucesso.'
        });
      } else {
        const existingLinks = await pb.collection('links').getList(1, 1, {
          filter: `usuario_id="${currentUser.id}"`,
          sort: '-ordem',
          $autoCancel: false
        });
        
        const maxOrdem = existingLinks.items.length > 0 ? existingLinks.items[0].ordem : 0;
        
        await pb.collection('links').create({
          usuario_id: currentUser.id,
          titulo,
          url,
          ordem: maxOrdem + 1
        }, { $autoCancel: false });
        
        toast({
          title: 'Sucesso!',
          description: 'Link adicionado com sucesso.'
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving link:', error);
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
