import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle.jsx';
import { 
  Plus, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Loader2, 
  Shield, 
  ShieldAlert,
  Sparkles 
} from 'lucide-react';
import LinkForm from '@/components/LinkForm.jsx';
import { ProfileIdentity, ProfileSEO, SecuritySection } from '@/components/ProfileSettings.jsx';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient.js';
import { logger } from '@/lib/logger.js';
import { SortableLink } from '@/components/SortableLink.jsx';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import MouseSpotlight from '@/components/common/MouseSpotlight.jsx';

const THEME_COLORS = [
  { id: 'tech-dark', value: '#080A0F', label: 'Tech Dark (Oficial)', border: '#6366F1' },
  { id: 'cobalt', value: '#0B132B', label: 'Cobalto Tech', border: '#3B82F6' },
  { id: 'slate', value: '#0F172A', label: 'Slate Obsidian', border: '#38BDF8' },
  { id: 'emerald', value: '#062016', label: 'Esmeralda Deep', border: '#10B981' },
  { id: 'crimson', value: '#1C0B14', label: 'Vinho Nobre', border: '#F43F5E' },
  { id: 'purple', value: '#140B24', label: 'Roxo Meia-Noite', border: '#A855F7' },
];

const DashboardPage = () => {
  const { currentUser, logout, updateUserColor } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [changingColor, setChangingColor] = useState(false);
  const { toast } = useToast();

  const publicUrl = `${window.location.origin}/${currentUser?.slug}`;
  const activeColor = currentUser?.cor_fundo || '#080A0F';

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
      description: 'O endereço do seu perfil foi copiado para a área de transferência.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleColorChange = async (color) => {
    if (changingColor || color.value === activeColor) return;
    setChangingColor(true);
    try {
      const res = await updateUserColor(color.value);
      if (res?.success) {
        toast({
          title: 'Aparência atualizada!',
          description: `Tema alterado para "${color.label}".`
        });
      } else {
        toast({
          title: 'Erro ao alterar cor',
          description: res?.error || 'Não foi possível atualizar a aparência.',
          variant: 'destructive'
        });
      }
    } finally {
      setChangingColor(false);
    }
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
          fetchLinks();
        } finally {
          setSavingOrder(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background mesh-bg text-foreground selection:bg-primary/30">
      {/* Interactive Cursor Spotlight */}
      <MouseSpotlight />

      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none fixed bottom-10 left-10 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => navigate('/')}
            title="Ir para a página inicial"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] via-[#2563EB] to-[#38BDF8] p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0E121A] rounded-[10px] flex items-center justify-center p-1">
                <img src="/favicon.svg" alt="contate.site" className="w-full h-full" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sora font-extrabold text-xl tracking-tight text-white">
                contate<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#38BDF8]">.site</span>
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary tracking-wide">
                Painel
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {currentUser?.is_admin && (
              <Button 
                variant="outline" 
                className="rounded-xl gap-2 font-semibold border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                onClick={() => navigate('/admin')}
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Console</span>
              </Button>
            )}
            <ThemeToggle />
            <Button 
              variant="outline" 
              className="hidden sm:flex rounded-xl gap-2 font-medium border-white/[0.1] bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copiado!' : 'Copiar Link'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          {/* Coluna Principal: Fluxo integrado (Identidade -> Meus Links -> SEO -> Segurança) */}
          <div className="space-y-8">
            {/* 1. Identidade do Perfil (Nome de Exibição & Bio) */}
            <ProfileIdentity />

            {/* 2. Meus Links (Integrado diretamente no início, abaixo da Identidade) */}
            <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                    Meus Links
                    {savingOrder && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </h2>
                  <p className="text-muted-foreground text-sm">Adicione, edite ou arraste para organizar a ordem dos seus links</p>
                </div>
                
                <Button 
                  onClick={() => {
                    setEditingLink(null);
                    setIsFormOpen(true);
                  }}
                  className="rounded-xl gap-2 bg-gradient-to-r from-[#6366F1] via-[#4F46E5] to-[#3B82F6] hover:from-[#4F46E5] hover:to-[#2563EB] text-white shadow-lg shadow-indigo-500/25 border-0 font-semibold relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                  <Plus className="h-4 w-4" />
                  Adicionar Link
                </Button>
              </div>

              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">Carregando seus links...</p>
                </div>
              ) : links.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-14 px-4 bg-muted/10 rounded-2xl border border-dashed border-white/[0.08]"
                >
                  <div className="bg-primary/10 border border-primary/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Share2 className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">Nenhum link cadastrado ainda</h3>
                  <p className="text-muted-foreground mb-5 max-w-sm mx-auto text-xs leading-relaxed">
                    Comece adicionando seu WhatsApp, redes sociais, loja virtual ou catálogo de produtos.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setEditingLink(null);
                      setIsFormOpen(true);
                    }}
                    className="rounded-xl border-primary/30 hover:bg-primary/10 hover:border-primary/60 font-semibold text-sm"
                  >
                    Adicionar meu primeiro link
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

            {/* 3. Configurações de SEO */}
            <ProfileSEO />

            {/* 4. Segurança (Minimalista e compacto no final de tudo) */}
            <SecuritySection />
          </div>

          {/* Coluna Lateral: Informações Fixas & Estilo */}
          <div className="space-y-6">
            {/* Card: Seu Link Exclusivo & Permanente */}
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-heading font-bold text-lg">Seu Link Exclusivo</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary">
                  Fixo
                </span>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Este é seu endereço oficial na web para bio do Instagram, WhatsApp e cartões.
              </p>
              
              <div className="flex items-center gap-2 bg-background/80 border border-white/[0.08] p-3 rounded-xl mb-3 group-hover:border-primary/30 transition-colors">
                <span className="text-sm font-semibold truncate flex-1 text-primary">
                  contate.site/{currentUser?.slug}
                </span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handleCopyLink}
                  className="h-8 w-8 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors shrink-0"
                  title="Copiar link"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <Button 
                variant="default" 
                className="w-full rounded-xl gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/20 font-semibold transition-all duration-300 hover:scale-[1.01]"
                onClick={() => window.open(publicUrl, '_blank', 'noopener,noreferrer')}
              >
                Ver minha página
                <ExternalLink className="h-4 w-4" />
              </Button>

              {/* Declaração de Responsabilidade sobre Titularidade de Marca */}
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex gap-2.5 items-start">
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-amber-300 block text-[11px] uppercase tracking-wide">
                    Declaração de Titularidade
                  </span>
                  <p className="text-[11px] leading-relaxed text-amber-200/80">
                    O seu link é permanente. Caso este perfil represente uma empresa, produto ou marca, você declara sob responsabilidade legal ser o titular legítimo ou representante autorizado. O uso indevido de nomes e marcas registradas de terceiros pode acarretar na suspensão imediata da conta conforme nossos Termos de Uso.
                  </p>
                </div>
              </div>
            </div>

            {/* Card: Aparência Básica (Cores reais funcionando) */}
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Aparência Básica
                </h3>
                {changingColor && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Selecione o tema de cor de fundo que melhor combina com a sua identidade visual:
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {THEME_COLORS.map(color => {
                    const isSelected = activeColor === color.value;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={`group relative p-2 rounded-2xl border transition-all flex flex-col items-center gap-1.5 text-center ${
                          isSelected 
                            ? 'border-primary bg-primary/10 shadow-md shadow-primary/20 scale-[1.03]' 
                            : 'border-white/[0.08] hover:border-white/20 bg-background/40 hover:bg-background/80'
                        }`}
                        title={color.label}
                      >
                        <span 
                          className="w-8 h-8 rounded-full shadow-inner border border-white/20 flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ backgroundColor: color.value }}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
                        </span>
                        <span className="text-[10px] font-medium truncate w-full text-foreground/80">
                          {color.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Tema selecionado:</span>
                  <span className="font-semibold text-primary">
                    {THEME_COLORS.find(c => c.value === activeColor)?.label || 'Tech Dark'}
                  </span>
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
