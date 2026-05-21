import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard, Share2, Copy, Check, ExternalLink, Loader2, Shield } from 'lucide-react';
import LinkForm from '@/components/LinkForm.jsx';
import ProfileSettings from '@/components/ProfileSettings.jsx';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient.js';
import { logger } from '@/lib/logger.js';
import { SortableLink } from '@/components/SortableLink.jsx';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const DashboardPage = () => {
  const { currentUser, logout, updateUserColor } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const { toast } = useToast();

  const publicUrl = `${window.location.origin}/${currentUser?.slug}`;

  const fetchLinks = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blocos_links')
        .select('*')
        .eq('usuario_id', currentUser.id)
        .order('ordem', { ascending: true });
        
      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      logger.error('Error fetching links:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus links.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDeleteLink = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este link?')) return;
    try {
      const { error } = await supabase
        .from('blocos_links')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Sucesso!',
        description: 'Link removido.'
      });
      fetchLinks();
    } catch (error) {
      logger.error('Error deleting link:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o link.',
        variant: 'destructive'
      });
    }
  }, [fetchLinks, toast]);

  const handleEditLink = useCallback((l) => {
    setEditingLink(l);
    setIsFormOpen(true);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast({
      title: 'Link copiado!',
      description: 'O link do seu perfil foi copiado para a área de transferência.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      let newOrder = [];
      setLinks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        
        // Update ordem locally
        newOrder = reordered.map((item, index) => ({
          ...item,
          ordem: index + 1
        }));
        
        return newOrder;
      });

      // Save new order to Supabase
      if (newOrder.length > 0) {
        setSavingOrder(true);
        try {
          // Envia apenas id + ordem — nunca dados completos do link
          // O banco valida via RLS que o usuário só pode alterar seus próprios links
          const updates = newOrder.map(link => ({
            id: link.id,
            ordem: link.ordem,
          }));

          const { error } = await supabase
            .from('blocos_links')
            .upsert(updates);

          if (error) throw error;
        } catch (error) {
          logger.error('Error updating order:', error);
          toast({
            title: 'Erro ao reordenar',
            description: 'Não foi possível salvar a nova ordem dos links.',
            variant: 'destructive'
          });
          // Revert on error
          fetchLinks();
        } finally {
          setSavingOrder(false);
        }
      }
    }
  };

  const THEME_COLORS = [
    { id: 'zinc', value: '240 5.9% 10%', label: 'Dark Zinc' },
    { id: 'slate', value: '222.2 84% 4.9%', label: 'Deep Blue' },
    { id: 'emerald', value: '160 50% 15%', label: 'Forest' },
    { id: 'rose', value: '346 45% 15%', label: 'Crimson' },
    { id: 'amber', value: '30 60% 15%', label: 'Sunset' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">Painel</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {currentUser?.is_admin && (
              <Button 
                variant="outline" 
                className="rounded-xl gap-2 font-semibold border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => navigate('/admin')}
              >
                <Shield className="h-4 w-4" />
                <span className="hidden xs:inline">Console Admin</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              className="hidden sm:flex rounded-xl gap-2 font-medium"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copiar Link
            </Button>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-8">
            <ProfileSettings />

            <div className="glass-card rounded-3xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                    Meus Links
                    {savingOrder && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </h2>
                  <p className="text-muted-foreground">Gerencie o conteúdo da sua página</p>
                </div>
                
                <Button 
                  onClick={() => {
                    setEditingLink(null);
                    setIsFormOpen(true);
                  }}
                  className="rounded-xl gap-2 shadow-lg shadow-primary/20"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Link
                </Button>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Carregando seus links...</p>
                </div>
              ) : links.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 px-4 bg-muted/30 rounded-2xl border border-dashed border-border"
                >
                  <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Share2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nenhum link ainda</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Crie seu primeiro link e comece a compartilhar seu conteúdo com o mundo.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setEditingLink(null);
                      setIsFormOpen(true);
                    }}
                    className="rounded-xl"
                  >
                    Criar meu primeiro link
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={links.map(l => l.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence>
                        {links.map((link) => (
                          <SortableLink
                            key={link.id}
                            link={link}
                            onEdit={handleEditLink}
                            onDelete={handleDeleteLink}
                          />
                        ))}
                      </AnimatePresence>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-heading font-bold text-lg mb-2">Seu Link Público</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Compartilhe este link na bio do seu Instagram, TikTok e outras redes.
              </p>
              
              <div className="flex items-center gap-2 bg-background/50 border border-border p-3 rounded-xl mb-4">
                <span className="text-sm font-medium truncate flex-1 text-primary">
                  contate.site/{currentUser?.slug}
                </span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handleCopyLink}
                  className="h-8 w-8 rounded-lg"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <Button 
                variant="default" 
                className="w-full rounded-xl gap-2"
                onClick={() => window.open(publicUrl, '_blank')}
              >
                Ver minha página
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-heading font-bold text-lg mb-4">Aparência Básica</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Cor de Fundo Principal</label>
                  <div className="flex flex-wrap gap-3">
                    {THEME_COLORS.map(color => (
                      <button
                        key={color.id}
                        onClick={() => updateUserColor(color.value)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                          currentUser?.cor_fundo === color.value ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: `hsl(${color.value})` }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LinkForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        link={editingLink}
        onSuccess={fetchLinks}
      />
    </div>
  );
};

export default DashboardPage;
