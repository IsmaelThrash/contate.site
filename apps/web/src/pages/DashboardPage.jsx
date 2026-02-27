
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, GripVertical, ExternalLink, Copy, Palette, User, LogOut, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import LinkForm from '@/components/LinkForm.jsx';
import Header from '@/components/Header.jsx';
import ProfileSettings from '@/components/ProfileSettings.jsx';

const DashboardPage = () => {
  const { currentUser, logout, updateUserColor } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [corFundo, setCorFundo] = useState('#ffffff');
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setCorFundo(currentUser.cor_fundo || '#ffffff');
      fetchLinks();
    }
  }, [currentUser]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('links').getList(1, 100, {
        filter: `usuario_id="${currentUser.id}"`,
        sort: 'ordem',
        $autoCancel: false
      });
      setLinks(records.items);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar links.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Tem certeza que deseja excluir este link?')) {
      return;
    }

    try {
      await pb.collection('links').delete(linkId, { $autoCancel: false });
      toast({
        title: 'Sucesso!',
        description: 'Link excluído com sucesso.'
      });
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao excluir link.',
        variant: 'destructive'
      });
    }
  };

  const handleColorChange = async (e) => {
    const newColor = e.target.value;
    setCorFundo(newColor);

    const result = await updateUserColor(newColor);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: 'Cor de fundo atualizada.'
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar cor.',
        variant: 'destructive'
      });
    }
  };

  const copyProfileUrl = () => {
    const url = `contate.site/${currentUser.slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copiado!',
      description: 'URL do perfil copiado para a área de transferência.'
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - contate.site</title>
        <meta name="description" content="Gerencie seus links e personalize sua página no contate.site." />
      </Helmet>

      <div className="min-h-screen mesh-bg">
        <Header />

        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-3xl p-6 sticky top-28"
              >
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-br from-primary to-secondary p-1 rounded-full w-24 h-24 mx-auto mb-4 shadow-lg">
                    <div className="bg-card w-full h-full rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h2 className="font-heading font-bold text-xl mb-1 truncate">{currentUser?.email}</h2>
                  <p className="text-primary font-medium">@{currentUser?.slug}</p>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <ExternalLink className="h-4 w-4" />
                      Seu Link
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={`contate.site/${currentUser?.slug}`}
                        readOnly
                        className="bg-background/50 text-sm font-medium"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={copyProfileUrl}
                        className="shrink-0 rounded-xl"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="corFundo" className="flex items-center gap-2 text-muted-foreground">
                      <Palette className="h-4 w-4" />
                      Cor de Fundo
                    </Label>
                    <div className="flex gap-3 items-center bg-background/50 p-2 rounded-xl border border-input/50">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-inner border border-border">
                        <input
                          id="corFundo"
                          type="color"
                          value={corFundo}
                          onChange={handleColorChange}
                          className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                        />
                      </div>
                      <span className="text-sm font-mono font-medium uppercase">
                        {corFundo}
                      </span>
                    </div>
                  </div>

                  {currentUser?.status === 0 && (
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                      <p className="text-sm text-accent font-semibold flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Conta aguardando ativação
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 text-destructive hover:bg-destructive hover:text-white hover:border-destructive"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Sair da Conta
                </Button>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 xl:col-span-9">
              <ProfileSettings />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-6 md:p-10"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                  <div>
                    <h1 className="text-3xl font-heading font-bold mb-2">Meus Links</h1>
                    <p className="text-muted-foreground">Gerencie os links que aparecem no seu perfil</p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingLink(null);
                      setShowLinkForm(true);
                    }}
                    className="shadow-primary/25"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Adicionar Link
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Carregando seus links...</p>
                  </div>
                ) : links.length === 0 ? (
                  <div className="text-center py-20 bg-background/30 rounded-3xl border border-dashed border-border">
                    <div className="bg-primary/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Plus className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-3">Nenhum link ainda</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Comece adicionando seu primeiro link para construir sua página personalizada.
                    </p>
                    <Button
                      onClick={() => {
                        setEditingLink(null);
                        setShowLinkForm(true);
                      }}
                      size="lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Adicionar Primeiro Link
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {links.map((link, index) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="cursor-grab active:cursor-grabbing p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                              <GripVertical className="h-5 w-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-heading font-bold text-lg mb-1 truncate text-foreground">
                                {link.titulo}
                              </h3>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary hover:underline truncate block transition-colors"
                              >
                                {link.url}
                              </a>
                            </div>

                            <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  setEditingLink(link);
                                  setShowLinkForm(true);
                                }}
                                className="rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleDeleteLink(link.id)}
                                className="rounded-xl hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <LinkForm
        open={showLinkForm}
        onOpenChange={setShowLinkForm}
        link={editingLink}
        onSuccess={fetchLinks}
      />
    </>
  );
};

export default DashboardPage;
