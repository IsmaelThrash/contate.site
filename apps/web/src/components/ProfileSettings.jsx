
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, AlignLeft, Search, Check, Loader2, AtSign, AlertTriangle, ShieldAlert, RefreshCw, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient.js';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';

const ProfileSettings = () => {
    const { currentUser, updateProfile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome_exibicao: '',
        bio: '',
        meta_titulo: '',
        meta_descricao: '',
        slug: ''
    });
    const [showSlugWarning, setShowSlugWarning] = useState(false);
    const [reservedSlugs, setReservedSlugs] = useState([]);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                nome_exibicao: currentUser.nome_exibicao || '',
                bio: currentUser.bio || '',
                meta_titulo: currentUser.meta_titulo || '',
                meta_descricao: currentUser.meta_descricao || '',
                slug: currentUser.slug || ''
            });

            // Buscar histórico de slugs reservados
            const fetchReservedSlugs = async () => {
                const { data } = await supabase
                    .from('slugs_reservados')
                    .select('*')
                    .eq('usuario_id', currentUser.id)
                    .order('liberado_em', { ascending: false });
                if (data) setReservedSlugs(data);
            };
            fetchReservedSlugs();
        }
    }, [currentUser]);

    const handleReclaimSlug = (oldSlug) => {
        setFormData(prev => ({ ...prev, slug: oldSlug }));
        setShowSlugWarning(true);
    };

    const getDaysLeft = (dateString) => {
        const targetDate = new Date(dateString);
        const diffTime = targetDate - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSlugChange = (e) => {
        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setFormData(prev => ({ ...prev, slug: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verifica se o slug foi alterado
        if (currentUser && formData.slug && formData.slug !== currentUser.slug) {
            setShowSlugWarning(true);
            return;
        }

        await executeSave();
    };

    const executeSave = async () => {
        setLoading(true);
        setShowSlugWarning(false);

        // Se o slug mudou, chama o RPC primeiro
        if (currentUser && formData.slug && formData.slug !== currentUser.slug) {
            const { data: claimed, error: rpcError } = await supabase.rpc('claim_slug', {
                p_user_id: currentUser.id,
                p_slug: formData.slug,
            });

            if (rpcError || !claimed) {
                toast({
                    title: 'Link indisponível',
                    description: 'O link que você escolheu já está em uso ou é inválido.',
                    variant: 'destructive'
                });
                setLoading(false);
                return;
            }
        }

        const profileData = {
            nome_exibicao: formData.nome_exibicao,
            bio: formData.bio,
            meta_titulo: formData.meta_titulo,
            meta_descricao: formData.meta_descricao,
            slug: formData.slug
        };

        const result = await updateProfile(profileData);

        if (result.success) {
            toast({
                title: 'Perfil atualizado!',
                description: 'Suas informações foram salvas com sucesso.'
            });
            // Opcional: Atualizar a página para limpar caches ou garantir roteamento seguro
            if (formData.slug !== currentUser.slug) {
                window.location.reload();
            }
        } else {
            toast({
                title: 'Erro ao atualizar',
                description: result.error,
                variant: 'destructive'
            });
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-6 md:p-8 mb-8"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary/10 p-3 rounded-2xl">
                    <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-heading font-bold">Perfil & SEO</h2>
                    <p className="text-muted-foreground">Como você aparece para o mundo</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="slug" className="flex items-center gap-2">
                            <AtSign className="h-4 w-4 text-primary" />
                            Seu Link Exclusivo
                        </Label>
                        <div className="flex items-center bg-background/50 border border-border rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden px-1">
                          <span className="pl-3 pr-1 text-muted-foreground font-medium select-none">contate.site/</span>
                          <input
                              id="slug"
                              name="slug"
                              value={formData.slug}
                              onChange={handleSlugChange}
                              placeholder="seu-link"
                              className="flex-1 bg-transparent border-none focus:outline-none text-foreground font-medium h-10 px-1 min-w-0"
                          />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="nome_exibicao" className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Nome de Exibição
                        </Label>
                        <Input
                            id="nome_exibicao"
                            name="nome_exibicao"
                            value={formData.nome_exibicao}
                            onChange={handleChange}
                            placeholder="Ex: Ismael Thrash"
                            className="bg-background/50"
                        />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="bio" className="flex items-center gap-2">
                            <AlignLeft className="h-4 w-4 text-primary" />
                            Bio / Descrição Curta
                        </Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Uma frase marcante sobre você ou seu trabalho..."
                            className="bg-background/50 min-h-[100px] rounded-2xl"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-6 text-primary font-bold">
                        <Search className="h-5 w-5" />
                        Configurações de SEO (Google/Redes Sociais)
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="meta_titulo">Título da Página (Meta Title)</Label>
                            <Input
                                id="meta_titulo"
                                name="meta_titulo"
                                value={formData.meta_titulo}
                                onChange={handleChange}
                                placeholder="Ex: Ismael Thrash | Desenvolvedor Fullstack"
                                className="bg-background/50"
                            />
                            <p className="text-[10px] text-muted-foreground px-1">Ideal: até 60 caracteres</p>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="meta_descricao">Descrição da Página (Meta Description)</Label>
                            <Textarea
                                id="meta_descricao"
                                name="meta_descricao"
                                value={formData.meta_descricao}
                                onChange={handleChange}
                                placeholder="Ex: Central de links oficial do Ismael. Confira meus projetos, redes sociais e muito mais."
                                className="bg-background/50 min-h-[80px] rounded-xl"
                            />
                            <p className="text-[10px] text-muted-foreground px-1">Ideal: entre 140-160 caracteres</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl h-12 px-8 gap-2 shadow-lg shadow-primary/20"
                    >
                        {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
                        ) : (
                            <><Check className="h-4 w-4" /> Salvar Alterações</>
                        )}
                    </Button>
                </div>
            </form>

            {/* Zona de Segurança / Danger Zone */}
            <div className="mt-12 pt-8 border-t border-destructive/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-destructive/10 p-2.5 rounded-xl">
                        <ShieldAlert className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <h3 className="text-xl font-heading font-bold text-destructive">Segurança e Histórico</h3>
                        <p className="text-sm text-muted-foreground">Gerencie seus links em carência e ações irreversíveis</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Lista de Reservas no Cofre */}
                    {reservedSlugs.length > 0 && (
                        <div className="bg-background/40 border border-border rounded-2xl p-5 space-y-4">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                Links no Cofre (Protegidos)
                            </h4>
                            <div className="space-y-3">
                                {reservedSlugs.map((reserva) => {
                                    const daysLeft = getDaysLeft(reserva.liberado_em);
                                    return (
                                        <div key={reserva.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/60 p-4 rounded-xl border border-border/50">
                                            <div>
                                                <p className="font-bold text-primary font-mono text-lg">contate.site/{reserva.slug}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Sua reserva expira em: <strong className={daysLeft < 5 ? "text-destructive" : "text-foreground"}>{daysLeft} dias</strong>
                                                </p>
                                            </div>
                                            <Button 
                                                type="button"
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleReclaimSlug(reserva.slug)}
                                                className="gap-2 rounded-xl"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                                Resgatar Link
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Excluir Conta */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-foreground">Excluir Conta Permanentemente</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Apaga todos os seus links, configurações e libera seu slug imediatamente. Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        <Button type="button" variant="destructive" className="shrink-0 gap-2 rounded-xl">
                            <Trash2 className="h-4 w-4" />
                            Excluir Minha Conta
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal de Aviso do Slug */}
            <Dialog open={showSlugWarning} onOpenChange={setShowSlugWarning}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive text-xl">
                            <AlertTriangle className="h-5 w-5" />
                            Atenção: Mudança de Link
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-4">
                        <p className="text-sm text-foreground/90">
                            Você está alterando seu link de <strong className="text-primary">contate.site/{currentUser?.slug}</strong> para <strong className="text-primary">contate.site/{formData.slug}</strong>.
                        </p>
                        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-sm text-destructive-foreground">
                            O seu link atual ficará reservado exclusivamente para você por <strong>30 dias</strong> no nosso cofre de segurança.
                            Durante este período:
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Nenhum outro usuário poderá registrá-lo.</li>
                                <li>Seus cartões de visita e links antigos deixarão de funcionar imediatamente.</li>
                                <li>Você poderá voltar para este link se quiser.</li>
                            </ul>
                        </div>
                        <p className="text-sm text-foreground/90 font-medium text-center">
                            Tem certeza que deseja mudar seu link?
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-xl">Cancelar</Button>
                        </DialogClose>
                        <Button 
                            onClick={executeSave}
                            variant="destructive"
                            className="rounded-xl"
                        >
                            Confirmar Mudança
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default ProfileSettings;
