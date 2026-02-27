
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, AlignLeft, Search, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileSettings = () => {
    const { currentUser, updateProfile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome_exibicao: '',
        bio: '',
        meta_titulo: '',
        meta_descricao: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                nome_exibicao: currentUser.nome_exibicao || '',
                bio: currentUser.bio || '',
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

        const result = await updateProfile(formData);

        if (result.success) {
            toast({
                title: 'Perfil atualizado!',
                description: 'Suas informações de SEO e biografia foram salvas.'
            });
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
        </motion.div>
    );
};

export default ProfileSettings;
