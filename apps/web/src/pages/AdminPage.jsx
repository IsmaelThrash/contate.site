import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import { 
  Search, 
  Users, 
  Shield, 
  Sparkles, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  ExternalLink, 
  Loader2,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient.js';
import { logger } from '@/lib/logger.js';
import { isVip } from '@/vips/registry.jsx';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVip, setFilterVip] = useState(false);
  const [filterAdmin, setFilterAdmin] = useState(false);

  // Edit State
  const [selectedUser, setSelectedUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete State
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      logger.error('Error fetching users:', error);
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message || 'Ocorreu um erro ao obter os perfis.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update profile handler (name/bio)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_exibicao: editName,
          bio: editBio,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: 'Perfil atualizado!',
        description: `O perfil do usuário @${selectedUser.slug} foi atualizado com sucesso.`,
      });
      
      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      logger.error('Error updating user profile:', error);
      toast({
        title: 'Erro ao atualizar',
        description: error.message || 'Falha ao salvar as edições.',
        variant: 'destructive',
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // Toggle Admin status
  const handleToggleAdmin = async (user) => {
    if (user.id === currentUser.id) {
      toast({
        title: 'Ação Bloqueada',
        description: 'Você não pode revogar os seus próprios privilégios de administrador.',
        variant: 'destructive',
      });
      return;
    }

    const nextAdminState = !user.is_admin;
    const actionLabel = nextAdminState ? 'conceder' : 'revogar';

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ is_admin: nextAdminState })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: `Privilégio alterado!`,
        description: `Sucesso ao ${actionLabel} permissões de administrador para @${user.slug}.`,
      });
      fetchUsers();
    } catch (error) {
      logger.error('Error toggling admin privilege:', error);
      toast({
        title: 'Erro de permissão',
        description: error.message || 'Não foi possível alterar a função do usuário.',
        variant: 'destructive',
      });
    }
  };

  // Delete profile handler
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      toast({
        title: 'Ação Bloqueada',
        description: 'Você não pode excluir a sua própria conta por aqui.',
        variant: 'destructive',
      });
      return;
    }

    setDeletingUser(true);
    try {
      // 1. Delete user blocks (in case cascade is not fully configured)
      await supabase
        .from('blocos_links')
        .delete()
        .eq('usuario_id', userToDelete.id);

      // 2. Delete user profile
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', userToDelete.id);

      if (error) throw error;

      toast({
        title: 'Perfil excluído!',
        description: `O perfil do usuário @${userToDelete.slug} foi removido com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      logger.error('Error deleting user profile:', error);
      toast({
        title: 'Erro ao excluir perfil',
        description: error.message || 'Falha ao remover a conta do usuário.',
        variant: 'destructive',
      });
    } finally {
      setDeletingUser(false);
    }
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setEditName(user.nome_exibicao || '');
    setEditBio(user.bio || '');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // Filtered lists
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.nome_exibicao || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const isVipUser = isVip(user.slug);
    const matchesVip = !filterVip || isVipUser;
    const matchesAdmin = !filterAdmin || user.is_admin;

    return matchesSearch && matchesVip && matchesAdmin;
  });

  const totalVipsCount = users.filter((u) => isVip(u.slug)).length;
  const totalAdminsCount = users.filter((u) => u.is_admin).length;

  return (
    <>
      <Helmet>
        <title>Console Admin - contate.site</title>
      </Helmet>

      <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-primary/30">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
          <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/dashboard')}
                className="rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 text-primary p-2 rounded-xl border border-primary/20">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-heading font-black text-lg tracking-tight block">Console Admin</span>
                  <span className="text-[10px] text-zinc-500 font-mono -mt-1 block">contate.site v2</span>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Voltar ao Meu Dashboard
            </Button>
          </div>
        </header>

        <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 p-6 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Users className="h-24 w-24" />
              </div>
              <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Total de Usuários</p>
              <h3 className="text-4xl font-black mt-2 font-heading tracking-tight">{loading ? '...' : users.length}</h3>
              <p className="text-xs text-zinc-400 mt-2">Contas ativas e inativas no Supabase</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 p-6 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles className="h-24 w-24" />
              </div>
              <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Landing Pages VIP</p>
              <h3 className="text-4xl font-black mt-2 font-heading tracking-tight text-primary">{loading ? '...' : totalVipsCount}</h3>
              <p className="text-xs text-zinc-400 mt-2">Mapeadas dinamicamente via repositório</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 p-6 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck className="h-24 w-24" />
              </div>
              <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Administradores</p>
              <h3 className="text-4xl font-black mt-2 font-heading tracking-tight text-teal-400">{loading ? '...' : totalAdminsCount}</h3>
              <p className="text-xs text-zinc-400 mt-2">Contas com permissões de Console</p>
            </motion.div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-zinc-900/25 border border-zinc-900/50 p-4 rounded-2xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Buscar por slug ou nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-500 rounded-xl focus-visible:ring-primary/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={filterVip ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterVip(!filterVip)}
                className="rounded-xl gap-1.5 text-xs font-semibold"
              >
                <Sparkles className="h-3.5 w-3.5" />
                VIPs ({totalVipsCount})
              </Button>
              
              <Button
                variant={filterAdmin ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterAdmin(!filterAdmin)}
                className="rounded-xl gap-1.5 text-xs font-semibold"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admins ({totalAdminsCount})
              </Button>

              {(searchQuery || filterVip || filterAdmin) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterVip(false);
                    setFilterAdmin(false);
                  }}
                  className="text-zinc-500 hover:text-white rounded-xl text-xs"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* User List Table */}
          <div className="bg-zinc-900/20 border border-zinc-900/80 rounded-3xl overflow-hidden shadow-2xl">
            {loading ? (
              <div className="py-24 text-center text-zinc-500 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="font-medium">Carregando banco de dados...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-24 text-center text-zinc-500 bg-zinc-950/20 border border-dashed border-zinc-900 m-4 rounded-2xl">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-bold text-zinc-400">Nenhum usuário encontrado</p>
                <p className="text-sm text-zinc-600 mt-1">Refine a sua busca ou limpe os filtros selecionados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-zinc-900/80 bg-zinc-900/40 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Usuário</th>
                      <th className="py-4 px-6">Bio</th>
                      <th className="py-4 px-6">Cadastro</th>
                      <th className="py-4 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    <AnimatePresence mode="popLayout">
                      {filteredUsers.map((user) => {
                        const isVipUser = isVip(user.slug);
                        return (
                          <motion.tr 
                            layout
                            key={user.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-zinc-900/20 transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <div className="h-11 w-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-white font-bold font-heading shadow-inner">
                                  {(user.nome_exibicao || user.slug).charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-zinc-200 truncate flex items-center gap-2">
                                    {user.nome_exibicao || '@' + user.slug}
                                    <div className="flex gap-1.5">
                                      {user.is_admin && (
                                        <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
                                          ADMIN
                                        </span>
                                      )}
                                      {isVipUser && (
                                        <span className="bg-primary/20 text-primary border border-primary/25 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
                                          VIP
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-zinc-500 text-xs font-medium flex items-center gap-1">
                                    contate.site/{user.slug}
                                    <a 
                                      href={`/${user.slug}`} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-zinc-600 hover:text-white p-0.5 rounded transition-colors"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-zinc-400 text-sm max-w-xs truncate">
                              {user.bio || <span className="text-zinc-700 italic">Sem bio informada</span>}
                            </td>
                            <td className="py-4 px-6 text-zinc-500 text-xs font-mono">
                              {new Date(user.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(user)}
                                  className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                                  title="Editar perfil"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleAdmin(user)}
                                  disabled={user.id === currentUser.id}
                                  className={`h-8 w-8 rounded-lg ${
                                    user.is_admin 
                                      ? 'text-teal-400 hover:text-red-400 hover:bg-red-500/10' 
                                      : 'text-zinc-500 hover:text-teal-400 hover:bg-teal-500/10'
                                  }`}
                                  title={user.is_admin ? "Remover privilégio admin" : "Tornar admin"}
                                >
                                  {user.is_admin ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(user)}
                                  disabled={user.id === currentUser.id}
                                  className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                  title="Excluir conta"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Modal: Editar Perfil de Outro Usuário */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-zinc-950 border-zinc-900 text-zinc-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Editar Perfil: @{selectedUser?.slug}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName" className="text-sm font-semibold">Nome de Exibição</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nome exibido no perfil"
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl focus-visible:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editBio" className="text-sm font-semibold">Biografia</Label>
                <Textarea
                  id="editBio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Biografia do perfil (máximo 160 caracteres)"
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl focus-visible:ring-primary/50 min-h-[100px]"
                  maxLength={160}
                />
              </div>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={savingEdit}
                  className="rounded-xl shadow-lg shadow-primary/20"
                >
                  {savingEdit ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal: Confirmação de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-zinc-950 border-zinc-900 text-zinc-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-500">
                <Trash2 className="h-5 w-5" />
                Excluir Conta: @{userToDelete?.slug}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-3">
              <p className="text-sm text-zinc-300 leading-relaxed">
                Você tem certeza absoluta que deseja excluir permanentemente o perfil de <span className="text-white font-bold">{userToDelete?.nome_exibicao || '@' + userToDelete?.slug}</span>?
              </p>
              <p className="text-xs text-red-400 bg-red-950/20 border border-red-950/50 p-3 rounded-xl leading-relaxed">
                ⚠️ **Atenção:** Esta ação é irreversível e excluirá o perfil público do usuário, suas configurações de cores e todos os blocos de links criados por ele.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white" disabled={deletingUser}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button 
                onClick={handleDeleteUser}
                disabled={deletingUser}
                variant="destructive"
                className="rounded-xl shadow-lg shadow-red-500/10"
              >
                {deletingUser ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Excluindo...</>
                ) : (
                  'Confirmar Exclusão'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminPage;
