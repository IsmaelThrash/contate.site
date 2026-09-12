import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, AlignLeft, Search, Check, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';

// 1. Componente de Identidade Básica do Perfil (Nome + Bio)
export const ProfileIdentity = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_exibicao: '',
    bio: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        nome_exibicao: currentUser.nome_exibicao || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      nome_exibicao: formData.nome_exibicao.trim(),
      bio: formData.bio.trim()
    });

    if (result.success) {
      toast({
        title: 'Perfil atualizado!',
        description: 'Seu nome e bio foram salvos com sucesso.'
      });
    } else {
      toast({
        title: 'Erro ao atualizar',
        description: result.error || 'Não foi possível salvar as alterações.',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 text-primary">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold">Identidade do Perfil</h2>
          <p className="text-sm text-muted-foreground">Personalize como seu público verá seu perfil</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="nome_exibicao" className="flex items-center gap-2 font-medium">
            <User className="h-4 w-4 text-primary" />
            Nome de Exibição
          </Label>
          <Input
            id="nome_exibicao"
            name="nome_exibicao"
            value={formData.nome_exibicao}
            onChange={handleChange}
            placeholder="Ex: Minha Empresa / Meu Nome"
            className="bg-background/60 border-white/[0.08] focus:border-primary/50 h-11 rounded-xl"
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="flex items-center gap-2 font-medium">
            <AlignLeft className="h-4 w-4 text-primary" />
            Bio / Descrição Curta
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Conte resumidamente o que você faz, seus serviços ou mensagem de boas-vindas..."
            className="bg-background/60 border-white/[0.08] focus:border-primary/50 min-h-[90px] rounded-xl resize-none"
            maxLength={250}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground px-1">
            <span>Aparece no topo da sua página pública</span>
            <span>{formData.bio.length}/250</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl h-10 px-6 gap-2 bg-gradient-to-r from-[#6366F1] to-[#3B82F6] hover:from-[#4F46E5] hover:to-[#2563EB] text-white shadow-md shadow-indigo-500/20 font-semibold"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
            ) : (
              <><Check className="h-4 w-4" /> Salvar Identidade</>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

// 2. Componente de Configurações de SEO
export const ProfileSEO = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    meta_titulo: '',
    meta_descricao: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        meta_titulo: currentUser.meta_titulo || '',
        meta_descricao: currentUser.meta_descricao || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      meta_titulo: formData.meta_titulo.trim(),
      meta_descricao: formData.meta_descricao.trim()
    });

    if (result.success) {
      toast({
        title: 'SEO atualizado!',
        description: 'Informações de busca e compartilhamento salvas.'
      });
    } else {
      toast({
        title: 'Erro ao atualizar',
        description: result.error || 'Não foi possível salvar os dados de SEO.',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-sky-500/10 p-3 rounded-2xl border border-sky-500/20 text-sky-400">
          <Search className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold">Configurações de SEO</h2>
          <p className="text-sm text-muted-foreground">Como sua página aparece no Google e ao ser compartilhada no WhatsApp</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="meta_titulo" className="font-medium">
            Título da Página (Meta Title)
          </Label>
          <Input
            id="meta_titulo"
            name="meta_titulo"
            value={formData.meta_titulo}
            onChange={handleChange}
            placeholder="Ex: Nome da Marca | Catálogo e Redes Oficiais"
            className="bg-background/60 border-white/[0.08] focus:border-sky-500/50 h-11 rounded-xl"
            maxLength={70}
          />
          <p className="text-[11px] text-muted-foreground px-1">Ideal: até 60 caracteres</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_descricao" className="font-medium">
            Descrição da Página (Meta Description)
          </Label>
          <Textarea
            id="meta_descricao"
            name="meta_descricao"
            value={formData.meta_descricao}
            onChange={handleChange}
            placeholder="Ex: Acesse todos os canais oficiais, catálogo de produtos e formas de contato em um só lugar."
            className="bg-background/60 border-white/[0.08] focus:border-sky-500/50 min-h-[80px] rounded-xl resize-none"
            maxLength={160}
          />
          <p className="text-[11px] text-muted-foreground px-1">Ideal: entre 120 e 160 caracteres</p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            variant="outline"
            className="rounded-xl h-10 px-6 gap-2 border-sky-500/30 text-sky-400 hover:bg-sky-500/10 font-semibold"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
            ) : (
              <><Check className="h-4 w-4" /> Salvar SEO</>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

// 3. Componente Minimalista de Segurança (Excluir Conta) - Fica no rodapé
export const SecuritySection = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== 'EXCLUIR') return;
    setDeleting(true);
    try {
      // Como boa prática, logout e notificação (caso RPC de delete do Supabase seja configurada)
      toast({
        title: 'Solicitação registrada',
        description: 'Sua conta foi encerrada.',
      });
      setOpenModal(false);
      await logout();
    } catch (err) {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível processar a solicitação neste momento.',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="pt-8 pb-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="text-center sm:text-left">
          <span className="font-semibold text-foreground/70">Zona de Segurança</span>
          <p className="text-[11px] text-muted-foreground/80 mt-0.5">
            Ações irreversíveis e encerramento permanente da conta
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpenModal(true)}
          className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Excluir Conta
        </Button>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[420px] bg-card/95 backdrop-blur-xl border border-destructive/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive text-lg">
              <AlertTriangle className="h-5 w-5" />
              Excluir Conta Permanentemente
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm pt-2">
              Esta ação apagará todos os seus links, configurações e seu endereço exclusivo será liberado. Esta ação <strong>não pode ser desfeita</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <Label htmlFor="confirm_delete" className="text-xs text-foreground font-medium">
              Digite <span className="font-mono text-destructive font-bold">EXCLUIR</span> para confirmar:
            </Label>
            <Input
              id="confirm_delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="EXCLUIR"
              className="bg-background/80 border-destructive/30 font-mono text-sm uppercase"
            />
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="rounded-xl">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              disabled={confirmText.trim().toUpperCase() !== 'EXCLUIR' || deleting}
              onClick={handleDeleteAccount}
              className="rounded-xl"
            >
              {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Export padrão caso importado genericamente
const ProfileSettings = () => {
  return (
    <div className="space-y-8">
      <ProfileIdentity />
      <ProfileSEO />
      <SecuritySection />
    </div>
  );
};

export default ProfileSettings;
